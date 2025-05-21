// src/features/data_routine/feature/data/datasources/local/tables/drift_table_parser.ts
import { IDriftTableParser, Reference } from "../../../../../../../core/interfaces/drift_table_parser";
import { Field } from "./drift_class_parser";
import { unCap } from "../../../../../../../utils/text_work/text_util";
import { RelationType, TableRelation } from "../../../../../../../features/data_routine/interfaces/table_relation.interface";


export class DriftTableParser implements IDriftTableParser {
  private driftClass: string;
  private _className: string;
  private _fields: Field[] = [];
  private _primaryKey: string[] = [];
  private _references: Reference[] = [];

  constructor(driftClass: string) {
    this.driftClass = driftClass;
    this._className = this.extractClassName();
    this._fields = this.extractFields();
    this._primaryKey = this.extractPrimaryKey();
    this._references = this.extractReferences();
  }

  getClassName(): string {
    return this._className;
  }

  getClassNameLower(): string {
    return unCap(this._className);
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
    if (this._references.length < 2) {
      return false;
    }
    const referenceFields = this._references.map(ref => ref.columnName);
    return this._primaryKey.length === referenceFields.length &&
           this._primaryKey.every(field => referenceFields.includes(field));
  }

  getRelatedTables(): string[] {
    if (!this.isRelationTable()) {
      return [];
    }
    return this._references.map(ref => {
      const tableName = ref.referencedTable;
      return tableName.endsWith('Table') ? tableName.slice(0, -5) : tableName;
    });
  }

  private extractClassName(): string {
    const match = this.driftClass.match(/class\s+(\w+)Table\s+extends\s+Table/);
    return match ? match[1] : "";
  }

  private extractFields(): Field[] {
    const fieldsRegex = /(\w+Column)\s+get\s+(\w+)\s*=>\s*(.+?);/g;
    const fields: Field[] = [];
    let fieldMatch;

    while ((fieldMatch = fieldsRegex.exec(this.driftClass)) !== null) {
        const columnTypeString = fieldMatch[1]; // e.g., "TextColumn"
        const fieldName = fieldMatch[2];    // e.g., "categoryId"
        const fieldDefinition = fieldMatch[3]; // e.g., "text().nullable().references(CategoryTable, #id)()"

        const isNullable = fieldDefinition.includes(".nullable()");
        const baseType = columnTypeString.replace('Column', ''); // "Text"
        const convertedType = this.convertDriftType(baseType);  // "String"

        fields.push({
            name: fieldName,
            type: convertedType,
            isNullable: isNullable
        });
    }
    return fields;
  }

  private extractPrimaryKey(): string[] {
    const primaryKeyRegex = /Set<Column>\s+get\s+primaryKey\s+=>\s+{([^}]+)}/;
    const match = primaryKeyRegex.exec(this.driftClass);
    if (!match) {
      return [];
    }
    return match[1].split(',')
      .map(field => field.trim())
      .filter(field => field.length > 0);
  }

  private extractReferences(): Reference[] {
    const referenceRegex = /(\w+)\s*=>\s*\w+\(\)(?:\s*\.(?:[a-zA-Z_][a-zA-Z0-9_]*)\(\))*\s*\.references\((\w+Table),\s*#(\w+)\)/g;
    const references: Reference[] = [];
    let match;
    while ((match = referenceRegex.exec(this.driftClass)) !== null) {
      references.push({
        columnName: match[1],
        referencedTable: match[2],
        referencedColumn: match[3]
      });
    }
    return references;
  }

  private convertDriftType(driftType: string): string {
    if (driftType === 'Text') {
      return 'String';
    } else if (driftType === 'Int') {
      return 'int';
    }
    // Для Bool, DateTime и других типов, оставляем как есть или конвертируем в lowercase, если нужно
    return driftType.toLowerCase() === 'bool' ? 'bool' : driftType;
  }


  getTableRelations(): TableRelation[] {
    const relations: TableRelation[] = [];
    if (this.isRelationTable()) {
      const refs = this.getReferences();
      if (refs.length === 2) {
        const firstTable = refs[0].referencedTable.replace('Table', '');
        const firstField = refs[0].columnName;
        const secondTable = refs[1].referencedTable.replace('Table', '');
        const secondField = refs[1].columnName;
        relations.push({
          sourceTable: firstTable,
          targetTable: secondTable,
          relationType: RelationType.MANY_TO_MANY,
          intermediateTable: this.getClassName(),
          sourceField: firstField,
          targetField: secondField
        });
      }
    } else {
      for (const ref of this.getReferences()) {
        const targetTable = ref.referencedTable.replace('Table', '');
        relations.push({
          sourceTable: this.getClassName(),
          targetTable: targetTable,
          relationType: RelationType.ONE_TO_MANY,
          sourceField: ref.columnName,
          targetField: ref.referencedColumn
        });
      }
    }
    return relations;
  }
}