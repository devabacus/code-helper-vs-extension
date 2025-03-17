import * as fs from 'fs';
import * as path from 'path';

/**
 * Создает index.dart файлы в указанной директории и всех её поддиректориях,
 * исключая создание index.dart только в точных директориях из списка исключений,
 * но при этом обрабатывая все их поддиректории
 * @param directoryPath Путь к директории, в которой нужно создать index.dart файлы
 * @param excludedDirs Массив имен директорий, в которых не нужно создавать index.dart
 */
export async function createIndexDartFiles(
  directoryPath: string, 
  excludedDirs: string[] = ['lib', 'features']
): Promise<void> {
  try {
    // Проверка существования директории
    if (!fs.existsSync(directoryPath)) {
      console.error(`Директория не существует: ${directoryPath}`);
      return;
    }

    // Получаем абсолютный путь и имя текущей директории
    const absolutePath = path.resolve(directoryPath);
    const dirName = path.basename(absolutePath);
    
    // Определяем, является ли текущая директория исключаемой
    const isExcludedDir = excludedDirs.includes(dirName);
    
    // Получаем содержимое директории
    const items = fs.readdirSync(directoryPath);
    
    // Фильтруем только директории и .dart файлы (кроме index.dart)
    const directories: string[] = [];
    const dartFiles: string[] = [];
    
    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        directories.push(item);
      } else if (stat.isFile() && item.endsWith('.dart') && item !== 'index.dart') {
        dartFiles.push(item);
      }
    }
    
    // Рекурсивно обрабатываем поддиректории НЕЗАВИСИМО от того, исключена ли текущая директория
    for (const dir of directories) {
      const subdirPath = path.join(directoryPath, dir);
      await createIndexDartFiles(subdirPath, excludedDirs);
    }
    
    // Создаем index.dart ТОЛЬКО если текущая директория НЕ в списке исключений
    if (!isExcludedDir) {
      // Создаем содержимое index.dart
      let indexContent = '';
      
      // Добавляем экспорты для всех .dart файлов в текущей директории
      for (const dartFile of dartFiles) {
        indexContent += `export '${dartFile}';\n`;
      }
      
      // Добавляем экспорты для index.dart в поддиректориях
      for (const dir of directories) {
        const subdirPath = path.join(directoryPath, dir);
        
        // Проверяем не находится ли поддиректория в списке исключений
        if (!excludedDirs.includes(dir)) {
          // Проверяем существование index.dart в поддиректории перед добавлением экспорта
          const indexFilePath = path.join(subdirPath, 'index.dart');
          if (fs.existsSync(indexFilePath)) {
            indexContent += `export '${dir}/index.dart';\n`;
          }
        }
      }
      
      // Записываем index.dart даже если он пустой, чтобы обеспечить последовательность
      const indexPath = path.join(directoryPath, 'index.dart');
      fs.writeFileSync(indexPath, indexContent);
      console.log(`Создан файл: ${indexPath}`);
    } else {
      console.log(`Пропускаем создание index.dart в исключенной директории: ${directoryPath}`);
    }
    
  } catch (error) {
    console.error(`Ошибка при обработке директории ${directoryPath}:`, error);
  }
}

