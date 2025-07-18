// src/generator/FileProcessor.ts

import * as fs from 'fs/promises';
import * as path from 'path';

// Интерфейс для одного правила замены
export interface ReplacementRule {
  from: string | RegExp;
  to: string;
}

// Конфигурация для обработки ОДНОГО файла
export interface ProcessingParams {
  sourcePath: string;
  destinationPath: string;
  rules: ReplacementRule[];
}

export class FileProcessor {
  
  public async processFile(params: ProcessingParams): Promise<void> {
    const { sourcePath, destinationPath, rules } = params;

    // Гарантируем, что папка для нового файла существует
    await fs.mkdir(path.dirname(destinationPath), { recursive: true });

    // Если правил нет, это статическое копирование
    if (rules.length === 0) {
      await fs.copyFile(sourcePath, destinationPath);
      return;
    }

    // Если правила есть, выполняем замену
    let content = await fs.readFile(sourcePath, 'utf-8');

    for (const rule of rules) {
      // 'g' - флаг для глобальной замены всех вхождений
      const regex = new RegExp(rule.from, 'g');
      content = content.replace(regex, rule.to);
    }

    await fs.writeFile(destinationPath, content, 'utf-8');
  }
}