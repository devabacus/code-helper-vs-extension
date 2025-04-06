// src/features/data_routine/interfaces/table_relation.interface.ts

export enum RelationType {
  ONE_TO_MANY = 'ONE_TO_MANY',
  MANY_TO_MANY = 'MANY_TO_MANY',
  ONE_TO_ONE = 'ONE_TO_ONE'
}

export interface TableRelation {
  sourceTable: string;        // Имя исходной таблицы
  targetTable: string;        // Имя целевой таблицы
  relationType: RelationType; // Тип связи
  intermediateTable?: string; // Имя промежуточной таблицы (для many-to-many)
  sourceField: string;        // Поле связи в исходной таблице
  targetField: string;        // Поле связи в целевой таблице
}