// src/features/data_routine/relations/table_relations_info.ts

import { RelationType, TableRelation } from '../interfaces/table_relation.interface';

export interface ITableRelationsInfo {
  relations: TableRelation[];
  addRelation(relation: TableRelation): void;
  getRelationsForTable(tableName: string): TableRelation[];
  hasRelations(tableName: string): boolean;
}

export class TableRelationsInfo implements ITableRelationsInfo {
  relations: TableRelation[] = [];

  addRelation(relation: TableRelation): void {
    this.relations.push(relation);
  }

  getRelationsForTable(tableName: string): TableRelation[] {
    return this.relations.filter(relation => 
      relation.sourceTable === tableName || 
      relation.targetTable === tableName || 
      relation.intermediateTable === tableName
    );
  }

  hasRelations(tableName: string): boolean {
    return this.relations.some(relation => 
      relation.sourceTable === tableName || 
      relation.targetTable === tableName || 
      relation.intermediateTable === tableName
    );
  }
}