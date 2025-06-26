import { ServerpodModel, ServerpodField, ServerpodIndex } from './types';
import { RelationAnalyzer } from './relation-analyzer';
import { IndexParser } from './index-parser';

export class ServerpodYamlParser {
  
  static parse(yamlContent: string): ServerpodModel {
    // filter(line => line); удаляет пустые строки
    const lines = yamlContent.split('\n').map(line => line.trim()).filter(line => line);
    
    let className = '';
    let tableName = '';
    const fields: ServerpodField[] = [];
    let indexes: ServerpodIndex[] = [];
    
    let inFieldsSection = false;
    let inIndexesSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Парсим class
      if (line.startsWith('class:')) {
        className = line.split(':')[1].trim();
        continue;
      }
      
      // Парсим table
      if (line.startsWith('table:')) {
        tableName = line.split(':')[1].trim();
        continue;
      }
      
      // Начало секции fields
      if (line.startsWith('fields:')) {
        inFieldsSection = true;
        inIndexesSection = false;
        continue;
      }
      
      // Начало секции indexes
      if (line.startsWith('indexes:')) {
        inFieldsSection = false;
        inIndexesSection = true;
        continue;
      }
      
      // Парсим поля
      if (inFieldsSection && line.includes(':')) {
        const field = this.parseField(line);
        if (field) {
          fields.push(field);
        }
      }
      
      // Парсим индексы
      if (inIndexesSection && line.includes(':')) {
        // Делегируем парсинг индексов в IndexParser
        const remainingLines = lines.slice(i);
        const parsedIndexes = IndexParser.parseIndexesSection(remainingLines, 0);
        indexes = parsedIndexes;
        break; // Прекращаем обработку, так как индексы обработаны
      }
    }
    
    return {
      className,
      tableName,
      fields,
      indexes: indexes.length > 0 ? indexes : undefined
    };
  }
  
  private static parseField(line: string): ServerpodField | null {
    // Разделяем по первому двоеточию
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return null;
    
    const fieldName = line.substring(0, colonIndex).trim();
    const fieldDefinition = line.substring(colonIndex + 1).trim();
    
    // Парсим тип и параметры
    const parts = fieldDefinition.split(',').map(part => part.trim());
    const typePart = parts[0];
    
    // Определяем nullable (если тип заканчивается на ?)
    const nullable = typePart.endsWith('?');
    const type = nullable ? typePart.slice(0, -1) : typePart;
    
    // Проверяем, является ли поле связью
    const isRelation = parts.includes('relation');
    
    const field: ServerpodField = {
      name: fieldName,
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
  
  // Парсинг нескольких моделей из одного файла
  static parseMultiple(yamlContent: string): ServerpodModel[] {
    const models: ServerpodModel[] = [];
    const sections = yamlContent.split(/(?=^class:)/m).filter(section => section.trim());
    
    for (const section of sections) {
      const model = this.parse(section);
      if (model.className) {
        models.push(model);
      }
    }
    
    return models;
  }
}