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

        let existingContent = '';
        let existingImports: Set<string> = new Set();
        let existingTableClasses: Set<string> = new Set();
        let currentSchemaVersion = 1;

        // Если файл уже существует, читаем его содержимое
        if (await this.fileSystem.exists(coreDatabasePath)) {
            existingContent = await this.fileSystem.readFile(coreDatabasePath);
            existingImports = this.extractSectionContent(existingContent, '// === GENERATED_IMPORTS_START ===', '// === GENERATED_IMPORTS_END ===');
            existingTableClasses = this.extractSectionContent(existingContent, '// === GENERATED_TABLES_START ===', '// === GENERATED_TABLES_END ===');
            currentSchemaVersion = this.extractSchemaVersion(existingContent);
        } else {
             // Если файл не существует, используем шаблон
            existingContent = appDatabaseCont;
        }

        // --- Шаг 2: Собираем информацию о файлах таблиц ---
        const coreTableFiles = (await this.fileSystem.readDirectory(coreTablesDir)).filter(file => file.endsWith('.dart'));     
        
        let featureTableFiles: string[] = [];
        if (await this.fileSystem.exists(featureTablesDir)) {
            featureTableFiles = (await this.fileSystem.readDirectory(featureTablesDir)).filter(file => file.endsWith('.dart'));
        }

        // --- Шаг 3: Генерируем контент для вставок ---
        // Генерируем новые импорты
        const newCoreImports = coreTableFiles.map(file => {
             const relativeCorePath = path.relative(destinationDir, coreTablesDir).replaceAll('\\', '/');
             return `import '${relativeCorePath}/${file}';`;
        });

        const newFeatureImports = featureTableFiles.map(file => {
             const relativeFeaturePath = path.relative(destinationDir, featureTablesDir).replaceAll('\\', '/');
             return `import '${relativeFeaturePath}/${file}';`;
        });
        
        const allImports = new Set([...existingImports, ...newCoreImports, ...newFeatureImports]);

        // Генерируем список новых классов таблиц
        const newCoreTableClasses = coreTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`);
        const newFeatureTableClasses = featureTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`);
        
        const allTableClasses = new Set([...existingTableClasses, ...newCoreTableClasses, ...newFeatureTableClasses]);

        // --- Шаг 4: Вставляем сгенерированный контент в шаблон ---
        let finalContent = this.updateSection(
            existingContent, 
            '// === GENERATED_IMPORTS_START ===', 
            '// === GENERATED_IMPORTS_END ===', 
            [...allImports].join('\n')
        );

        finalContent = this.updateSection(
            finalContent, 
            '// === GENERATED_TABLES_START ===', 
            '// === GENERATED_TABLES_END ===', 
            [...allTableClasses].join('\n    ')
        );

        // --- Шаг 5: Обновляем миграцию и версию ---
        if(!existingTableClasses.has(newFeatureTableClasses[0])) {            
            finalContent = this.updateMigration(finalContent, currentSchemaVersion, [...allTableClasses].join('\n    '));
        }
        
        // --- Шаг 6: Создаем или обновляем итоговый файл ---
        await this.fileSystem.createFile(coreDatabasePath, finalContent);
    }
    
    /**
     * Извлекает содержимое между маркерами и возвращает в виде Set.
     */
    private extractSectionContent(content: string, startMarker: string, endMarker: string): Set<string> {
        const regex = new RegExp(`${startMarker}\\s*([\\s\\S]*?)\\s*${endMarker}`, 'g');
        const match = regex.exec(content);
        if (match && match[1]) {
            return new Set(match[1].split('\n').map(line => line.trim()).filter(Boolean));
        }
        return new Set();
    }

    /**
     * Извлекает текущую версию схемы из файла.
     */
    private extractSchemaVersion(content: string): number {
        const regex = /int get schemaVersion => (\d+);/;
        const match = content.match(regex);
        return match ? parseInt(match[1], 10) : 1;
    }


    /**
     * Обновляет содержимое между двумя маркерами, сохраняя старое содержимое.
     */
    private updateSection(
        content: string,
        startMarker: string,
        endMarker: string,
        newContent: string
    ): string {
        const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
        const replacement = `${startMarker}\n${newContent}\n${endMarker}`;
        return content.replace(regex, replacement);
    }

    /**
     * Обновляет стратегию миграции, добавляя новую миграцию и увеличивая версию.
     */
    private updateMigration(content: string, currentVersion: number, newTablesContent: string): string {
        const newVersion = currentVersion + 1;
        const migrationMarker = '// === GENERATED_MIGRATION_START ===';
        const migrationEndMarker = '// === GENERATED_MIGRATION_END ===';
        const newMigrationBlock = `
        if (from < ${newVersion}) {
            // Добавление новой таблицы или изменение схемы
        }
        `;

        // Проверяем, существует ли уже блок миграции.
        // Если да, то добавляем новый блок миграции, иначе создаем его.
        if (content.includes(migrationMarker)) {
            const regex = new RegExp(`${migrationMarker}[\\s\\S]*?${migrationEndMarker}`, 'g');
            const replacement = `${migrationMarker}${newMigrationBlock}\n        ${migrationEndMarker}`;
            content = content.replace(regex, replacement);
        } else {
             // Если маркеров для миграции нет, просто добавляем новый блок.
            const onUpgradeRegex = /onUpgrade: \(Migrator m, int from, int to\) async {([\s\S]*?)}/;
            const newOnUpgrade = `onUpgrade: (Migrator m, int from, int to) async {
            ${migrationMarker}${newMigrationBlock}
        ${migrationEndMarker}
        }`;
        content = content.replace(onUpgradeRegex, newOnUpgrade);
        }

        // Обновляем версию
        content = content.replace(/int get schemaVersion => (\d+);/, `int get schemaVersion => ${newVersion};`);
        
        return content;
    }
}