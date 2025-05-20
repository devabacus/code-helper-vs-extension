// G:\Projects\vs_code_extensions\snippet\code-helper\src\features\data_routine\generators\serverpod_yaml_generator.ts

import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { DriftClassParser, Field as DriftField } from '../feature/data/datasources/local/tables/drift_class_parser';
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';
import { toSnakeCase, unCap, cap, pluralConvert } from '../../../utils/text_work/text_util';
import { RelationType, TableRelation } from '../interfaces/table_relation.interface';

export class ServerpodYamlGenerator extends BaseGenerator {
    constructor(fileSystem: IFileSystem) {
        super(fileSystem);
    }

    protected getPath(basePath: string, entityName: string): string {
        // entityName - это camelCase имя класса (например, "category")
        // Имя файла будет преобразовано в snake_case (например, category.spy.yaml)
        return path.join(basePath, `${toSnakeCase(entityName)}.spy.yaml`);
    }

    private mapDriftTypeToServerpod(
        driftFieldType: string,
        fieldName?: string,
        // Новый флаг, чтобы определить, является ли это поле FK, которое в Serverpod должно стать UuidValue?
        // (например, categoryId, taskId, tagId, если они ссылаются на UuidValue PK)
        isForeignKeyFieldThatShouldBeUuid: boolean = false
    ): string {
        // Поле id мы генерируем явно с UuidValue?
        if (fieldName === 'id' && driftFieldType === 'String') {
            return 'UuidValue?';
        }
        // Если это FK, который в Drift был String (ссылка на UUID PK), то в Serverpod он должен быть UuidValue?
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
        const driftReferences = tableParser.getReferences(); // FK, определенные в Drift-таблице

        // Коллекция для хранения имен полей Drift, которые являются FK и для которых будет создано объектное поле
        const fkFieldsHandledAsObjectRelations = new Set<string>();

        // --- Шаг 1: Определение, какие FK будут заменены объектными полями ---
        // (Необходимо для того, чтобы не генерировать их как обычные колонки, если Serverpod создаст их сам)
        for (const ref of driftReferences) {
            fkFieldsHandledAsObjectRelations.add(ref.columnName);
        }
        // Для M2M связей в промежуточной таблице (например, TaskTagMap),
        // поля taskId и tagId тоже будут заменены на task и tag.
        if (tableParser.isRelationTable()) {
            const m2mRefs = relations.filter(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === className);
            for (const m2mRef of m2mRefs) {
                // В TaskTagMap поля taskId и tagId также обрабатываются как FK, ведущие к объектным полям
                // DriftClassParser уже должен их вернуть, и они будут в driftReferences
            }
        }

        // --- Шаг 2: Генерация полей ---
        for (const field of classParser.fields) {
            if (field.name === 'id' && field.type === 'String') {
                yamlContent += `  id: UuidValue?, defaultPersist=random_v7\n`;
            } else if (!fkFieldsHandledAsObjectRelations.has(field.name)) {
                // Генерируем только те поля, которые не являются FK,
                // так как Serverpod создаст колонки для FK сам на основе объектных связей.
                // Это соответствует вашим последним рабочим YAML.
                const serverpodType = this.mapDriftTypeToServerpod(field.type, field.name, false);
                yamlContent += `  ${field.name}: ${serverpodType}\n`;
            }
        }

        // --- Шаг 3: Генерация полей для объектных отношений (O2M на стороне "many" и M2M в промежуточной таблице) ---
        for (const ref of driftReferences) {
            const referencedClassName = ref.referencedTable.replace('Table', '');
            const relationFieldName = unCap(referencedClassName); // category, task, tag

            yamlContent += `  ${relationFieldName}: ${referencedClassName}?, relation\n`;
            // Serverpod автоматически создаст колонку FK с именем <relationFieldName>Id (например, categoryId)
            // и свяжет ее с полем id в referencedClassName.
            // Атрибут 'parent=' можно использовать, если имя таблицы родителя нестандартное.
            // Атрибут 'field=' можно использовать, если имя колонки FK нестандартное (не <relationFieldName>Id).
            // В нашем случае, так как мы не генерируем явно categoryId в YAML для Task,
            // простой 'relation' должен сработать.
        }

        // --- Шаг 4: Генерация полей-списков ---
        // 4а: Для обратных связей O2M (на стороне "one", например, Category.tasks)
        const oneToManySources = relations.filter(r => r.relationType === RelationType.ONE_TO_MANY && r.targetTable === className);
        for (const o2mSource of oneToManySources) {
            const sourceClassName = o2mSource.sourceTable; // Task
            const listFieldName = `${unCap(pluralConvert(sourceClassName))}`; // tasks
            yamlContent += `  ${listFieldName}: List<${sourceClassName}>?, relation\n`;
        }

        // 4б: Для связей M2M (на "основных" таблицах, ссылающихся на список промежуточных)
        const isIntermediateM2MTable = tableParser.isRelationTable() &&
                                     relations.some(r => r.relationType === RelationType.MANY_TO_MANY && r.intermediateTable === className);
        if (!isIntermediateM2MTable && className.toLowerCase() !== "protocol") {
            const manyToManyParticipations = relations.filter(r =>
                r.relationType === RelationType.MANY_TO_MANY &&
                (r.sourceTable === className || r.targetTable === className)
            );

            for (const m2m of manyToManyParticipations) {
                if (m2m.intermediateTable) {
                     const intermediateModelName = m2m.intermediateTable; // TaskTagMap
                     const listFieldName = `${unCap(intermediateModelName)}s`; // taskTagMaps
                     
                     yamlContent += `  ${listFieldName}: List<${intermediateModelName}>?, relation\n`;
                }
            }
        }
         
        // --- Шаг 5: Обработка индексов ---
        if (className.toLowerCase() !== "protocol" && primaryKeyFieldsDrift.length > 0) {
            const isSimpleUuidIdPk = primaryKeyFieldsDrift.length === 1 && primaryKeyFieldsDrift[0] === 'id' &&
                                   classParser.fields.find(f => f.name === 'id')?.type === 'String';
            
            // Генерируем явный индекс только для составных PK.
            // Для одиночного 'id: UuidValue?, defaultPersist=random_v7' Serverpod/СУБД сами сделают его PK и проиндексируют.
            // Для одиночных PK из Drift, которые не называются 'id', тоже нужно явно определить индекс,
            // но в нашем случае все PK из Drift это 'id' или составные.
            if (!isSimpleUuidIdPk && primaryKeyFieldsDrift.length > 0) { 
                yamlContent += `indexes:\n`;
                yamlContent += `  ${tableName}_pkey: # Имя индекса для PK
    fields: ${primaryKeyFieldsDrift.join(', ')}
    unique: true\n`;
            }
        }
        return yamlContent;
    }
}