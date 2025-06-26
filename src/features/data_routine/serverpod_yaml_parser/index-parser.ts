import { ServerpodIndex } from './types';

export class IndexParser {
  
  // Парсинг одного индекса
  static parseIndex(line: string, lines: string[], currentIndex: number): ServerpodIndex | null {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return null;
    
    const indexName = line.substring(0, colonIndex).trim();
    
    // Ищем fields и unique в следующих строках
    let fields: string[] = [];
    let unique = false;
    
    for (let i = currentIndex + 1; i < lines.length; i++) {
      const nextLine = lines[i];
      
      // Если строка не начинается с пробелов, значит закончилась секция индекса
      if (!nextLine.startsWith(' ') && !nextLine.startsWith('\t')) {
        break;
      }
      
      if (nextLine.trim().startsWith('fields:')) {
        const fieldsValue = nextLine.split(':')[1].trim();
        fields = fieldsValue.split(',').map(f => f.trim());
      }
      
      if (nextLine.trim().startsWith('unique:')) {
        const uniqueValue = nextLine.split(':')[1].trim();
        unique = uniqueValue === 'true';
      }
    }
    
    return {
      name: indexName,
      fields,
      unique
    };
  }
  
  // Парсинг всех индексов из секции
  static parseIndexesSection(lines: string[], startIndex: number): ServerpodIndex[] {
    const indexes: ServerpodIndex[] = [];
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      
      // Если строка не относится к секции indexes, прекращаем
      if (!line.includes(':') || (!line.startsWith(' ') && !line.startsWith('\t') && i > startIndex)) {
        break;
      }
      
      // Пропускаем строки с fields: и unique: (они обрабатываются в parseIndex)
      if (line.trim().startsWith('fields:') || line.trim().startsWith('unique:')) {
        continue;
      }
      
      const index = this.parseIndex(line, lines, i);
      if (index) {
        indexes.push(index);
        // Пропускаем строки, которые уже обработали
        i += this.getIndexLinesCount(lines, i);
      }
    }
    
    return indexes;
  }
  
  // Подсчет количества строк, занимаемых индексом
  private static getIndexLinesCount(lines: string[], indexStartLine: number): number {
    let count = 0;
    
    for (let i = indexStartLine + 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Если строка не начинается с пробелов, значит закончилась секция индекса
      if (!line.startsWith(' ') && !line.startsWith('\t')) {
        break;
      }
      
      if (line.trim().startsWith('fields:') || line.trim().startsWith('unique:')) {
        count++;
      }
    }
    
    return count;
  }
  
  // Генерация Drift индекса
  static generateDriftIndex(index: ServerpodIndex, tableName: string): string {
    const fieldsStr = index.fields.map(field => `'${field}'`).join(', ');
    const uniqueStr = index.unique ? ', unique: true' : '';
    
    return `Index('${index.name}', [${fieldsStr}]${uniqueStr})`;
  }
  
  // Валидация индекса
  static validateIndex(index: ServerpodIndex): string[] {
    const errors: string[] = [];
    
    if (!index.name || index.name.trim() === '') {
      errors.push('Index name cannot be empty');
    }
    
    if (!index.fields || index.fields.length === 0) {
      errors.push('Index must have at least one field');
    }
    
    if (index.fields.some(field => !field || field.trim() === '')) {
      errors.push('Index field names cannot be empty');
    }
    
    return errors;
  }
}