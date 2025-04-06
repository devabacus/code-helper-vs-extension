import { Field } from '../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser';

export interface Reference {
  columnName: string;
  referencedTable: string;
  referencedColumn: string;
}

export interface IDriftTableParser {
  getClassName(): string;
  getClassNameLower(): string;
  getFields(): Field[];
  getPrimaryKey(): string[];
  getReferences(): Reference[];
  isRelationTable(): boolean;
  getRelatedTables(): string[];
}