import { IDriftTableParser, Reference } from "../../core/interfaces/drift_table_parser";
import { Field } from "../../features/data_routine/feature/data/datasources/local/tables/drift_class_parser";


export class MockDriftTableParser implements IDriftTableParser {
    private _className: string;
    private _fields: Field[];
    private _primaryKey: string[];
    private _references: Reference[];
    private _isRelationTable: boolean;
    private _relatedTables: string[];
  
    constructor(options: {
      className: string,
      fields: Field[],
      primaryKey?: string[],
      references?: Reference[],
      isRelationTable?: boolean,
      relatedTables?: string[]
    }) {
      this._className = options.className;
      this._fields = options.fields;
      this._primaryKey = options.primaryKey || [];
      this._references = options.references || [];
      this._isRelationTable = options.isRelationTable || false;
      this._relatedTables = options.relatedTables || [];
    }
  
    getClassName(): string {
      return this._className;
    }
  
    getClassNameLower(): string {
      return this._className.charAt(0).toLowerCase() + this._className.slice(1);
    }
  
    getFields(): Field[] {
      return this._fields;
    }
  
    getPrimaryKey(): string[] {
      return this._primaryKey;
    }
  
    getReferences(): Reference[] {
      return this._references;
    }
  
    isRelationTable(): boolean {
      return this._isRelationTable;
    }
  
    getRelatedTables(): string[] {
      return this._relatedTables;
    }
}