import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DriftClassParser } from '../feature/data/datasources/local/tables/drift_class_parser';
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';
import { toSnakeCase, unCap, cap, pluralConvert } from '../../../utils/text_work/text_util';
import { RelationType, TableRelation } from '../interfaces/table_relation.interface';

export class ServerpodYamlGenerator extends BaseGenerator {
    constructor(fileSystem: IFileSystem) {
        super(fileSystem);
    }

    protected getPath(basePath: string, entityName: string): string {
        return path.join(basePath, `${toSnakeCase(entityName)}.spy.yaml`);
    }

    private mapDriftTypeToServerpod(
        driftFieldType: string,
        fieldName?: string,
        isForeignKeyFieldThatShouldBeUuid: boolean = false
    ): string {
        if (fieldName === 'id' && driftFieldType === 'String') {
            return 'UuidValue?';
        }
        if (isForeignKeyFieldThatShouldBeUuid && driftFieldType === 'String') {
            return 'UuidValue?';
        }

        switch (driftFieldType) {
            case 'String': return 'String';
            case 'int': return 'int';
            case 'bool': return 'bool';
            case 'DateTime': return 'DateTime';
            default: return driftFieldType;
        }
    }

    protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
        const { classParser, tableParser } = data;
        const className = classParser.driftClassNameUpper;
        const tableName = toSnakeCase(className);

        let yamlContent = `class: ${className}\n`;
        if (className.toLowerCase() !== "protocol") {
             yamlContent += `table: ${tableName}\n`;
        }
        yamlContent += `fields:\n`;

        const relations = tableParser.getTableRelations();
        const primaryKeyFieldsDrift = tableParser.getPrimaryKey();
        const driftReferences = tableParser.getReferences(); 

        const fkFieldsHandledAsObjectRelations = new Set<string>();

        for (const ref of driftReferences) {
            fkFieldsHandledAsObjectRelations.add(ref.columnName);
        }
        
        if (tableParser.isRelationTable()) {
            const m2mRefs = relations.filter(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === className);
            for (const m2mRef of m2mRefs) {
                // No specific action needed here as fkFieldsHandledAsObjectRelations covers these via getReferences()
            }
        }

        for (const field of classParser.fields) {
            if (field.name === 'id' && field.type === 'String') {
                yamlContent += `  id: UuidValue?, defaultPersist=random_v7\n`;
            } else if (!fkFieldsHandledAsObjectRelations.has(field.name)) {
                const serverpodType = this.mapDriftTypeToServerpod(field.type, field.name, false);
                yamlContent += `  ${field.name}: ${serverpodType}\n`;
            }
        }

        for (const ref of driftReferences) {
            const referencedClassName = ref.referencedTable.replace('Table', '');
            const relationFieldName = unCap(referencedClassName); 
            yamlContent += `  ${relationFieldName}: ${referencedClassName}?, relation\n`;
        }

        const oneToManySources = relations.filter(r => r.relationType === RelationType.ONE_TO_MANY && r.targetTable === className);
        for (const o2mSource of oneToManySources) {
            const sourceClassName = o2mSource.sourceTable; 
            const listFieldName = `${unCap(pluralConvert(sourceClassName))}`; 
            yamlContent += `  ${listFieldName}: List<${sourceClassName}>?, relation\n`;
        }

        const isIntermediateM2MTable = tableParser.isRelationTable() &&
                                     relations.some(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === className);
        if (!isIntermediateM2MTable && className.toLowerCase() !== "protocol") {
            const manyToManyParticipations = relations.filter(r =>
                r.relationType === RelationType.MANY_TO_MANY &&
                (r.sourceTable === className || r.targetTable === className)
            );

            for (const m2m of manyToManyParticipations) {
                if (m2m.intermediateTable) {
                     const intermediateModelName = m2m.intermediateTable; 
                     const listFieldName = `${unCap(intermediateModelName)}s`; 
                     
                     yamlContent += `  ${listFieldName}: List<${intermediateModelName}>?, relation\n`;
                }
            }
        }
         
        if (className.toLowerCase() !== "protocol" && primaryKeyFieldsDrift.length > 0) {
            const isSimpleUuidIdPk = primaryKeyFieldsDrift.length === 1 && primaryKeyFieldsDrift[0] === 'id' &&
                                   classParser.fields.find(f => f.name === 'id')?.type === 'String';
            
            if (!isSimpleUuidIdPk && primaryKeyFieldsDrift.length > 0) { 
                yamlContent += `indexes:\n`;
                yamlContent += `  ${tableName}_pkey:\n`; // Убрал имя индекса, Serverpod сам сгенерирует
                yamlContent += `    fields: ${primaryKeyFieldsDrift.join(', ')}\n`;
                yamlContent += `    unique: true\n`;
            }
        }
        return yamlContent;
    }

    async generate(basePath: string, entityName: string, data: { classParser: DriftClassParser, tableParser: DriftTableParser }): Promise<void> {
        const { classParser, tableParser } = data;
        const currentEntityClassName = classParser.driftClassNameUpper; // Имя текущей сущности (например, Task)

        // 1. Генерируем и записываем YAML для текущей сущности
        const primaryYamlPath = this.getPath(basePath, entityName); // entityName здесь camelCase, getPath сделает snake_case
        const primaryYamlContent = this.getContent(data);
        await this.fileSystem.createFile(primaryYamlPath, primaryYamlContent);
        console.log(`Сгенерирован YAML для ${currentEntityClassName} в ${primaryYamlPath}`);

        // 2. Определяем связи "один ко многим", где текущая сущность является "многими" (sourceTable)
        const oneToManyRelations = tableParser.getTableRelations().filter(
            r => r.relationType === RelationType.ONE_TO_MANY && r.sourceTable === currentEntityClassName
        );

        for (const relation of oneToManyRelations) {
            const oneSideClassName = relation.targetTable; // Имя сущности на стороне "один" (например, Category)
            const manySideClassName = relation.sourceTable; // Имя текущей сущности (например, Task)
            
            const listFieldName = `${unCap(pluralConvert(manySideClassName))}`; // Имя поля-списка (например, tasks)
            
            const oneSideYamlFileName = `${toSnakeCase(oneSideClassName)}.spy.yaml`;
            const oneSideYamlPath = path.join(basePath, oneSideYamlFileName);

            console.log(`Попытка обновить файл "${oneSideClassName}" (${oneSideYamlPath}) для связи с ${manySideClassName}`);

            try {
                const fileExists = await this.fileSystem.fileExists(oneSideYamlPath);
                
                if (fileExists) {
                    let oneSideYamlContent = await this.fileSystem.readFile(oneSideYamlPath);
                    const fieldKeyToAdd = ` ${listFieldName}:`; // Проверяем с отступом
                    const fullLineRegex = new RegExp(`^\\s*${listFieldName}:`, "m");


                    if (!fullLineRegex.test(oneSideYamlContent)) {
                        const lines = oneSideYamlContent.split('\n');
                        let fieldsBlockEndIndex = -1; // Индекс строки, ПОСЛЕ которой вставлять новое поле
                        let indent = "  "; // Отступ по умолчанию

                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].trim() === "fields:") {
                                // Определяем отступ на основе следующей строки, если это поле
                                if (i + 1 < lines.length && lines[i+1].match(/^(\s+)\w+:/)) {
                                    indent = lines[i+1].match(/^(\s+)/)![0];
                                }
                                fieldsBlockEndIndex = i + 1; // Начальная позиция для вставки - сразу после "fields:"
                                // Ищем конец блока fields
                                for (let j = i + 1; j < lines.length; j++) {
                                    if (lines[j].trim() === "" || lines[j].startsWith(indent) || lines[j].match(/^(\s*)$/)) {
                                        // Это пустая строка, комментарий с таким же отступом или другое поле
                                        fieldsBlockEndIndex = j + 1;
                                    } else {
                                        // Это начало нового блока или непустая строка без нужного отступа
                                        break; 
                                    }
                                }
                                break;
                            }
                        }
                        
                        const lineToAdd = `${indent}${listFieldName}: List<${manySideClassName}>?, relation`;

                        if (fieldsBlockEndIndex !== -1) { // Секция 'fields:' найдена
                            lines.splice(fieldsBlockEndIndex, 0, lineToAdd);
                            oneSideYamlContent = lines.join('\n');
                        } else { // Секция 'fields:' не найдена, добавляем ее
                            oneSideYamlContent += (oneSideYamlContent.endsWith('\n\n') ? '' : (oneSideYamlContent.endsWith('\n') ? '\n' : '\n\n')) + `fields:\n${lineToAdd}\n`;
                        }

                        await this.fileSystem.createFile(oneSideYamlPath, oneSideYamlContent);
                        console.log(`Обновлен ${oneSideYamlFileName} добавлением поля: ${listFieldName}`);
                    } else {
                        console.log(`Поле, начинающееся с '${fieldKeyToAdd.trim()}' уже существует в ${oneSideYamlFileName}.`);
                    }
                } else {
                    console.warn(`Файл ${oneSideYamlPath} для сущности "${oneSideClassName}" не существует. Не удалось добавить поле-список ${listFieldName}.`);
                }
            } catch (error) {
                console.error(`Ошибка при обновлении ${oneSideYamlFileName}: ${error}`);
            }
        }
    }
}