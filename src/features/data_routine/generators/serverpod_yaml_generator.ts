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
        const { classParser, tableParser } = data; // classParser нам может и не понадобиться здесь, если tableParser имеет все поля
        const className = tableParser.getClassName(); // Используем tableParser для имени класса текущего YAML
        const tableName = toSnakeCase(className);
        const driftReferences = tableParser.getReferences(); // Получаем ссылки из tableParser

        let yamlContent = `class: ${className}\n`;
        if (className.toLowerCase() !== "protocol") {
             yamlContent += `table: ${tableName}\n`;
        }
        yamlContent += `fields:\n`;

        const relations = tableParser.getTableRelations();
        const primaryKeyFieldsDrift = tableParser.getPrimaryKey();
        
        const fkFieldsHandledAsObjectRelations = new Set<string>();
        for (const ref of driftReferences) {
            fkFieldsHandledAsObjectRelations.add(ref.columnName);
        }
        
        // Поля, которые не являются внешними ключами (или являются ID)
        for (const field of tableParser.getFields()) { // Используем поля из tableParser
            if (field.name === 'id' && field.type === 'String') { // Тип String для ID соответствует UuidValue?
                yamlContent += `  id: UuidValue?, defaultPersist=random_v7\n`;
            } else if (!fkFieldsHandledAsObjectRelations.has(field.name)) {
                // Определяем, должен ли тип поля быть UuidValue? на основе типа String и имени (если это FK, обрабатываемый как UuidValue)
                // Но здесь мы обрабатываем НЕ FK поля, поэтому просто маппинг типа.
                const serverpodType = this.mapDriftTypeToServerpod(field.type, field.name, false);
                yamlContent += `  ${field.name}: ${serverpodType}${field.isNullable ? '?' : ''}\n`; // Добавляем '?' если поле nullable в Drift
            }
        }

        // Добавляем поля для прямых FK (они станут объектными связями)
        for (const ref of driftReferences) {
            const referencedClassName = ref.referencedTable.replace('Table', '');
            const relationFieldName = unCap(referencedClassName);

            // Находим определение поля внешнего ключа в списке полей tableParser, чтобы проверить его nullability
            const fkField = tableParser.getFields().find(f => f.name === ref.columnName);
            // Если поле найдено и оно nullable в Drift, то и в Serverpod оно должно быть nullable
            const isFkNullableInDrift = fkField ? fkField.isNullable : false; 

            const serverpodRelationType = `${referencedClassName}${isFkNullableInDrift ? '?' : ''}`;
            yamlContent += `  ${relationFieldName}: ${serverpodRelationType}, relation\n`;
        }

        // ... (остальная часть метода getContent без изменений) ...
        // Логика для O2M и M2M связей (добавление List<...>) остается прежней,
        // так как List<?> в Serverpod обычно всегда nullable.

        // Пример (остальная часть логики индексов и т.д.)
        if (className.toLowerCase() !== "protocol") {
            const isSimpleUuidIdPk = primaryKeyFieldsDrift.length === 1 && primaryKeyFieldsDrift[0] === 'id' &&
                                   tableParser.getFields().find(f => f.name === 'id')?.type === 'String';
            
            const m2mRelationDetails = relations.find(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === className);

            if (m2mRelationDetails) {
                yamlContent += `indexes:\n`;
                const fk1NameInYaml = `${unCap(m2mRelationDetails.sourceTable)}Id`;
                const fk2NameInYaml = `${unCap(m2mRelationDetails.targetTable)}Id`;
                yamlContent += `  idx_${tableName}_${fk1NameInYaml}_${fk2NameInYaml}:\n`; 
                yamlContent += `    fields: ${fk1NameInYaml}, ${fk2NameInYaml}\n`;
                yamlContent += `    unique: true\n`;
            } else if (!isSimpleUuidIdPk && primaryKeyFieldsDrift.length > 0) { 
                yamlContent += `indexes:\n`;
                yamlContent += `  idx_${tableName}_${primaryKeyFieldsDrift.join('_')}:\n`;
                yamlContent += `    fields: ${primaryKeyFieldsDrift.join(', ')}\n`;
                yamlContent += `    unique: true\n`;
            }
        }
        return yamlContent;
    }

    async generate(basePath: string, entityName: string, data: { classParser: DriftClassParser, tableParser: DriftTableParser }): Promise<void> {
        const { classParser, tableParser } = data;
        const currentEntityClassName = classParser.driftClassNameUpper;

        const primaryYamlPath = this.getPath(basePath, entityName);
        const primaryYamlContent = this.getContent(data);
        await this.fileSystem.createFile(primaryYamlPath, primaryYamlContent);
        console.log(`Сгенерирован YAML для ${currentEntityClassName} в ${primaryYamlPath}`);

        // --- Логика обновления ДРУГИХ файлов ---

        // 1. Обновление файла на стороне "один" для O2M связей (когда ТЕКУЩАЯ сущность - "многие")
        // Например, если текущая Task, она ссылается на Category. Обновляем Category.yaml.
        const oneToManyRelationsWhereCurrentIsMany = tableParser.getTableRelations().filter(
            r => r.relationType === RelationType.ONE_TO_MANY && r.sourceTable === currentEntityClassName
        );

        for (const relation of oneToManyRelationsWhereCurrentIsMany) {
            const oneSideClassName = relation.targetTable;
            const manySideClassName = relation.sourceTable;
            const listFieldName = `${unCap(pluralConvert(manySideClassName))}`; // например, 'tasks' для Category
            await this.addRelationFieldToYaml(basePath, oneSideClassName, listFieldName, `List<${manySideClassName}>?`);
        }

        // 2. Если ТЕКУЩАЯ сущность - это промежуточная таблица M2M (например, TaskTagMap)
        // Обновляем YAML-файлы основных таблиц (Task.yaml и Tag.yaml).
        if (tableParser.isRelationTable()) {
            const m2mRelationDetails = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === currentEntityClassName);
            if (m2mRelationDetails) {
                const sourceTableForM2M = m2mRelationDetails.sourceTable; // Например, Task
                const targetTableForM2M = m2mRelationDetails.targetTable; // Например, Tag
                const intermediateTableName = m2mRelationDetails.intermediateTable!; // TaskTagMap

                // Имя поля-списка в основных таблицах будет основано на имени промежуточной таблицы
                const listFieldNameForIntermediate = `${unCap(pluralConvert(intermediateTableName))}`; // например, taskTagMaps

                // Обновляем YAML для sourceTable (например, Task), добавляя List<TaskTagMap>
                await this.addRelationFieldToYaml(basePath, sourceTableForM2M, listFieldNameForIntermediate, `List<${intermediateTableName}>?`);

                // Обновляем YAML для targetTable (например, Tag), добавляя List<TaskTagMap>
                await this.addRelationFieldToYaml(basePath, targetTableForM2M, listFieldNameForIntermediate, `List<${intermediateTableName}>?`);
            }
        }
    }

    private async addRelationFieldToYaml(basePath: string, targetEntityClassName: string, fieldName: string, fieldTypeWithList: string) {
        const targetYamlFileName = `${toSnakeCase(targetEntityClassName)}.spy.yaml`;
        const targetYamlPath = path.join(basePath, targetYamlFileName);

        console.log(`Попытка добавить поле '${fieldName}' в файл ${targetYamlFileName}`);

        try {
            const fileExists = await this.fileSystem.fileExists(targetYamlPath);
            if (fileExists) {
                let targetYamlContent = await this.fileSystem.readFile(targetYamlPath);
                const fieldLineRegex = new RegExp(`^\\s*${fieldName}:`, "m");

                if (!fieldLineRegex.test(targetYamlContent)) {
                    const lines = targetYamlContent.split('\n');
                    let fieldsStartIndex = -1;
                    let indent = "  "; // Используем два пробела по умолчанию, как в вашем getContent

                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].trim() === "fields:") {
                            fieldsStartIndex = i;
                            if (i + 1 < lines.length && lines[i + 1].match(/^(\s+)\w+:/)) {
                                indent = lines[i + 1].match(/^(\s+)/)![0];
                            }
                            break;
                        }
                    }
                    
                    const lineToAdd = `${indent}${fieldName}: ${fieldTypeWithList}, relation`;

                    if (fieldsStartIndex !== -1) {
                        let insertAtIndex = fieldsStartIndex + 1; 
                        for (let j = fieldsStartIndex + 1; j < lines.length; j++) {
                            if (lines[j].startsWith(indent) && lines[j].trim() !== "") {
                                insertAtIndex = j + 1; 
                            } else if (lines[j].trim() !== "" && !lines[j].startsWith(indent)) {
                                break;
                            }
                        }
                        lines.splice(insertAtIndex, 0, lineToAdd);
                        targetYamlContent = lines.join('\n');
                    } else { 
                        targetYamlContent += (targetYamlContent.endsWith('\n\n') ? '' : (targetYamlContent.endsWith('\n') ? '\n' : '\n\n')) + `fields:\n${lineToAdd}\n`;
                    }
                    await this.fileSystem.createFile(targetYamlPath, targetYamlContent);
                    console.log(`Обновлен ${targetYamlFileName} добавлением поля: ${fieldName}`);
                } else {
                    console.log(`Поле '${fieldName}' уже существует в ${targetYamlFileName}.`);
                }
            } else {
                console.warn(`Файл ${targetYamlPath} для сущности "${targetEntityClassName}" не существует. Не удалось добавить поле ${fieldName}.`);
            }
        } catch (error) {
            console.error(`Ошибка при обновлении ${targetYamlFileName}: ${error}`);
        }
    }
}