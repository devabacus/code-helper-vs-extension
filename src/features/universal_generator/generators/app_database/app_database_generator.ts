// universal_generator/generators/app_database/app_database_generator.ts

import path from "path";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { snakeToPascalCase } from "../../../../utils/text_work/text_util";
import { GenerationConfig } from "../../paths/generation_config";

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
        const featureTablesDir = this.config.featureTablesPath;

        // Определяем путь к шаблонному файлу
        const templateDatabasePath = path.join(this.config.templFlutterLibPath, 'core', 'data', 'datasources', 'local', 'database.dart');

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
            // Если файл не существует, используем шаблон из проекта и очищаем содержимое маркеров
            existingContent = await this.fileSystem.readFile(templateDatabasePath);

            // Очищаем содержимое всех генерируемых секций
            existingContent = this.updateSection(existingContent, '// === GENERATED_IMPORTS_START ===', '// === GENERATED_IMPORTS_END ===', '');
            existingContent = this.updateSection(existingContent, '// === GENERATED_TABLES_START ===', '// === GENERATED_TABLES_END ===', '');
            existingContent = this.updateSection(existingContent, '// === GENERATED_MIGRATION_START ===', '// === GENERATED_MIGRATION_END ===', '');

            // Сбрасываем версию схемы на 1 для нового проекта
            existingContent = existingContent.replace(/int get schemaVersion => \d+;/, 'int get schemaVersion => 1;');
        }

        // --- Шаг 2: Собираем информацию о файлах таблиц ---
        let featureTableFiles: string[] = [];
        if (await this.fileSystem.exists(featureTablesDir)) {
            featureTableFiles = (await this.fileSystem.readDirectory(featureTablesDir)).filter(file => file.endsWith('.dart'));
        }

        // --- Шаг 3: Генерируем контент для вставок ---
        const newFeatureImports = featureTableFiles.map(file => {
            const relativeFeaturePath = path.relative(destinationDir, featureTablesDir).replaceAll('\\', '/');
            return `import '${relativeFeaturePath}/${file}';`;
        });

        const allImports = new Set([...existingImports, ...newFeatureImports]);

        // Генерируем список новых классов таблиц
        const newFeatureTableClasses = featureTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`);

        const allTableClasses = new Set([...existingTableClasses, ...newFeatureTableClasses]);

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
        // Фильтруем только действительно новые таблицы (которых ещё нет в existingTableClasses)
        const actuallyNewTables = newFeatureTableClasses.filter(tableClass => !existingTableClasses.has(tableClass));
        if (actuallyNewTables.length > 0) {
            finalContent = this.updateMigration(finalContent, currentSchemaVersion, actuallyNewTables);
        }

        // --- Шаг 6: Заменяем имя базы данных ---
        finalContent = this.updateDatabaseName(finalContent, this.config.targetProject);

        // --- Шаг 7: Создаем или обновляем итоговый файл ---
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
     * Обновляет стратегию миграции, ДОБАВЛЯЯ новую миграцию к существующим.
     * @param newTableClasses - массив новых классов таблиц (например: ['TaskTable,', 'TagTable,'])
     */
    private updateMigration(content: string, currentVersion: number, newTableClasses: string[]): string {
        const newVersion = currentVersion + 1;
        const migrationMarker = '// === GENERATED_MIGRATION_START ===';
        const migrationEndMarker = '// === GENERATED_MIGRATION_END ===';

        // Генерируем команды createTable для каждой новой таблицы
        const createTableStatements = newTableClasses
            .map(tableClass => {
                // Убираем запятую в конце (TaskTable, -> TaskTable)
                const cleanTableClass = tableClass.replace(/,\s*$/, '');
                // Преобразуем в camelCase для имени переменной (TaskTable -> taskTable)
                const tableVarName = cleanTableClass.charAt(0).toLowerCase() + cleanTableClass.slice(1);
                return `await m.createTable(${tableVarName});`;
            })
            .join('\n            ');

        const newMigrationBlock = `
        if (from < ${newVersion}) {
            ${createTableStatements}
        }`;

        // Проверяем, существует ли уже блок миграции.
        if (content.includes(migrationMarker)) {
            // Извлекаем существующий контент между маркерами
            const existingContentRegex = new RegExp(`${migrationMarker}([\\s\\S]*?)${migrationEndMarker}`);
            const match = existingContentRegex.exec(content);
            const existingMigrations = match ? match[1] : '';

            // ДОБАВЛЯЕМ новый блок к существующим (новый сверху)
            const replacement = `${migrationMarker}${newMigrationBlock}${existingMigrations}${migrationEndMarker}`;
            content = content.replace(existingContentRegex, replacement);
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

    /**
     * Заменяет имя базы данных в методе _openConnection.
     */
    private updateDatabaseName(content: string, projectName: string): string {
        const dbNameRegex = /name:\s*'[^']+'/;
        return content.replace(dbNameRegex, `name: '${projectName}_flutter'`);
    }
}