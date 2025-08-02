// universal_generator/generators/app_database/app_database_generator.ts

import path from "path";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { snakeToPascalCase } from "../../../../utils/text_work/text_util";
import { GenerationConfig } from "../../paths/generation_config";
import { appDatabaseCont } from "./appdatabase_file";

/**
 * Генератор для файла AppDatabase.
 * Его задача - сканировать все файлы таблиц в проекте
 * и вставить их импорты и классы в главный файл базы данных.
 */
export class AppDatabaseGenerator {
    constructor(
        private fileSystem: IFileSystem,
        private config: GenerationConfig
    ) { }

    public async generate(): Promise<void> {
        // --- Шаг 1: Определяем пути ---
        const destinationDir = this.config.coreDataLocalPath;
        const coreDatabasePath = path.join(destinationDir, 'database.dart');
        const coreTablesDir = this.config.coreTablesPath;
        const featureTablesDir = this.config.featureTablesPath;

        // --- Шаг 2: Собираем информацию о файлах таблиц ---
        const coreTableFiles = (await this.fileSystem.readDirectory(coreTablesDir)).filter(file => file.endsWith('.dart'));     
        
        let featureTableFiles: string[] = [];
        if (await this.fileSystem.exists(featureTablesDir)) {
            featureTableFiles = (await this.fileSystem.readDirectory(featureTablesDir)).filter(file => file.endsWith('.dart'));
        }

        // --- Шаг 3: Генерируем контент для вставок ---

        // Генерируем импорты
        const relativeCorePath = path.relative(destinationDir, coreTablesDir).replaceAll('\\', '/');
        const coreImports = coreTableFiles.map(file => `import '${relativeCorePath}/${file}';`);

        const relativeFeaturePath = path.relative(destinationDir, featureTablesDir).replaceAll('\\', '/');
        const featureImports = featureTableFiles.map(file => `import '${relativeFeaturePath}/${file}';`);

        const allImports = [...coreImports, ...featureImports].join('\n');

        // Генерируем список классов таблиц
        const allTableClasses = [
            ...coreTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`),
            ...featureTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`)
        ].join('\n    ');

        // --- Шаг 4: Вставляем сгенерированный контент в шаблон ---
        let finalContent = this.replaceSection(
            appDatabaseCont, 
            '// === GENERATED_IMPORTS_START ===', 
            '// === GENERATED_IMPORTS_END ===', 
            allImports
        );

        finalContent = this.replaceSection(
            finalContent, 
            '// === GENERATED_TABLES_START ===', 
            '// === GENERATED_TABLES_END ===', 
            allTableClasses
        );
        
        // --- Шаг 5: Создаем итоговый файл ---
        await this.fileSystem.createFile(coreDatabasePath, finalContent);
    }

    /**
     * Простой метод для замены содержимого между двумя маркерами.
     * @param content Исходный контент файла.
     * @param startMarker Начальный маркер.
     * @param endMarker Конечный маркер.
     * @param newContent Новый контент для вставки.
     * @returns Контент с замененной секцией.
     */
    private replaceSection(
        content: string,
        startMarker: string,
        endMarker: string,
        newContent: string
    ): string {
        const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
        const replacement = `${startMarker}\n${newContent}\n${endMarker}`;
        return content.replace(regex, replacement);
    }
}