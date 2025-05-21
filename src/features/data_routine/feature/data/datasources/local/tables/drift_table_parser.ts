// src/features/data_routine/feature/data/datasources/local/tables/drift_table_parser.ts
import { IDriftTableParser, Reference } from "../../../../../../../core/interfaces/drift_table_parser";
import { Field } from "./drift_class_parser"; // Field уже должен содержать isNullable
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
    this._fields = this.extractFields(); // Будет использовать обновленный extractFields
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
    // Таблица считается связанной, если:
    // 1. У нее есть 2 или более внешних ключа
    // 2. Первичный ключ состоит из тех же полей, что и внешние ключи

    if (this._references.length < 2) {
      return false;
    }

    // Проверяем, что все reference-поля входят в первичный ключ
    const referenceFields = this._references.map(ref => ref.columnName);
    return this._primaryKey.length === referenceFields.length &&
           this._primaryKey.every(field => referenceFields.includes(field));
  }

  getRelatedTables(): string[] {
    if (!this.isRelationTable()) {
      return [];
    }

    // Возвращаем имена таблиц без суффикса "Table"
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
    // Обновленный регэкс для захвата типа, имени поля и опционального "?" для nullable
    const fieldRegex = /(\w+Column(?:\??))\s+get\s+(\w+)\s*=>/g;
    const fields: Field[] = [];
    let match;

    while ((match = fieldRegex.exec(this.driftClass)) !== null) {
      const driftTypeWithNull = match[1]; // e.g., "TextColumn" or "TextColumn?"
      const fieldName = match[2];

      const isNullable = driftTypeWithNull.endsWith('?');
      const driftTypeClean = isNullable ? driftTypeWithNull.slice(0, -1) : driftTypeWithNull; // Удаляем '?' если есть
      const convertedType = this.convertDriftType(driftTypeClean.replace('Column', '')); // Удаляем 'Column' перед конвертацией

      fields.push({
        name: fieldName,
        type: convertedType,
        isNullable: isNullable // <--- Сохраняем информацию о nullable
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

    // Извлекаем имена полей из первичного ключа
    return match[1].split(',')
      .map(field => field.trim())
      .filter(field => field.length > 0);
  }

  private extractReferences(): Reference[] {
    const referenceRegex = /(\w+)\s+=>\s+\w+\(\)\.references\((\w+),\s+#(\w+)\)\(\)/g;
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
    // driftType теперь приходит без 'Column' и '?'
    if (driftType === 'Text') {
      return 'String';
    } else if (driftType === 'Int') {
      return 'int';
    }
    return driftType.toLowerCase(); // 'Bool' -> 'bool', 'DateTime' -> 'datetime'
  }


  getTableRelations(): TableRelation[] {
    const relations: TableRelation[] = [];

    // Если это связующая таблица для many-to-many
    if (this.isRelationTable()) {
      // Здесь мы создаем связь many-to-many между двумя таблицами
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
      // Обрабатываем one-to-many связи
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