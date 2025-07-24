import path from "path";
import { IFileSystem } from "../../../../core/interfaces/file_system";
import { snakeToPascalCase } from "../../../../utils/text_work/text_util";
import { GenerationConfig } from "../../generation_config";
import { SectionConfig, SectionReplacer } from "../../section_config";
import { appDatabaseCont } from "./appdatabase_file";

export class AppDatabaseGenerator {
    constructor(
        private fileSystem: IFileSystem,
        private config: GenerationConfig
    ) { }

    public async generate(): Promise<void> {
        // --- Шаг 1: Определяем абсолютный путь к папке с генерируемым файлом ---
        const destinationDir = this.config.coreDataLocalPath;
        const coreDatabasePath = path.join(destinationDir, 'database.dart');    

        // --- Получаем пути к папкам с таблицами ---
        const coreTablesDir = this.config.coreTablesPath;
        const featureTablesDir = this.config.featureTablesPath;

        const coreTableFiles = await this.fileSystem.readDirectory(coreTablesDir);
        const featureTableFiles = (await this.fileSystem.readDirectory(featureTablesDir)).filter(file => file.endsWith('.dart'));

        // --- Шаг 2: Вычисляем относительные пути для импортов ---
        
        // Для таблиц в CORE
        const relativeCorePath = path.relative(destinationDir, coreTablesDir).replaceAll('\\', '/');
        const coreImports = coreTableFiles.map(file => `import '${relativeCorePath}/${file}';`);

        // Для таблиц в FEATURE
        const relativeFeaturePath = path.relative(destinationDir, featureTablesDir).replaceAll('\\', '/');
        const featureImports = featureTableFiles.map(file => `import '${relativeFeaturePath}/${file}';`);

        // --- Собираем все вместе ---
        const allImports = [
            ...coreImports,
            ...featureImports
        ].join('\n');

        const allTables = [
            ...coreTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`),
            ...featureTableFiles.map(file => `${snakeToPascalCase(file.split('.')[0])},`)
        ].join('\n    ');

        // ... остальная часть вашего кода для замены секций и создания файла остается без изменений
        const sectionsToReplace: SectionConfig[] = [
            {
                startMarker: '// === GENERATED_IMPORTS_START ===',
                endMarker: '// === GENERATED_IMPORTS_END ===',
                newContent: allImports
            },
            {
                startMarker: '// === GENERATED_TABLES_START ===',
                endMarker: '// === GENERATED_TABLES_END ===',
                newContent: allTables
            }
        ];
        
        const replacer = new SectionReplacer();
        const finalContent = replacer.process(appDatabaseCont, sectionsToReplace);
        await this.fileSystem.createFile(coreDatabasePath, finalContent);
    }
}



