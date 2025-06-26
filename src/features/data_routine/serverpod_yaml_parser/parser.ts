import * as yaml from 'js-yaml';
import { ServerpodModel, ServerpodField, ServerpodIndex } from './types';
import { RelationAnalyzer } from './relation-analyzer';

export class ServerpodYamlParser {
  
  static parse(yamlContent: string): ServerpodModel {
    const parsed = yaml.load(yamlContent) as any;
    
    return {
      className: parsed.class || '',
      tableName: parsed.table || '',
      fields: this.parseFields(parsed.fields || {}),
      indexes: this.parseIndexes(parsed.indexes)
    };
  }
  
  private static parseFields(fieldsObj: any): ServerpodField[] {
    return Object.entries(fieldsObj).map(([name, definition]) => 
      this.parseField(name, definition as string)
    );
  }
  
  private static parseField(name: string, definition: string): ServerpodField {
    // Парсим тип и параметры
    const parts = definition.split(',').map(part => part.trim());
    const typePart = parts[0];
    
    // Определяем nullable (если тип заканчивается на ?)
    const nullable = typePart.endsWith('?');
    const type = nullable ? typePart.slice(0, -1) : typePart;
    
    // Проверяем, является ли поле связью
    const isRelation = parts.includes('relation');
    
    const field: ServerpodField = {
      name,
      type,
      nullable,
      isRelation
    };
    
    // Анализируем тип связи, если это relation
    if (isRelation) {
      field.relationType = RelationAnalyzer.analyzeRelationType(type);
      field.relatedModel = RelationAnalyzer.extractRelatedModel(type);
    }
    
    // Парсим дополнительные параметры
    for (let i = 1; i < parts.length; i++) {
      const param = parts[i];
      
      if (param.startsWith('default=')) {
        field.defaultValue = param.split('=')[1];
      }
      
      if (param.startsWith('defaultPersist=')) {
        field.defaultPersist = param.split('=')[1];
      }
    }
    
    return field;
  }
  
  private static parseIndexes(indexesObj: any): ServerpodIndex[] | undefined {
    if (!indexesObj || typeof indexesObj !== 'object') {
      return undefined;
    }
    
    return Object.entries(indexesObj).map(([name, definition]) => 
      this.parseIndex(name, definition as any)
    );
  }
  
  private static parseIndex(name: string, definition: any): ServerpodIndex {
    return {
      name,
      fields: definition.fields || [],
      unique: definition.unique || false
    };
  }

}