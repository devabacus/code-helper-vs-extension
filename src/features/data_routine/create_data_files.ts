import { createFile, createFileOneTime, executeCommand, executeInTerminal, pathExists } from "../../utils";
import { getActiveEditorPath } from "../../utils/path_util";
import { unCap } from "../../utils/text_work/text_util";
import { getDocText } from "../../utils/ui/ui_util";
import { build_runner } from "../template_project/flutter_content/terminal_commands";
// import { addProviderFiles } from "./add_providers";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerateAllFilesCommand } from "./commands/generate_all_files_command";
import { appDatabaseRoutine } from './core/database/local/appdatabase_handle';
import { GeneratorFactory } from "./factories/generator_factory";
import { DriftClassParser } from "./feature/data/datasources/local/tables/drift_class_parser";
import { DartTestGeneratorFactory } from "./factories/test_generator_factory";
import { GenerateTestFilesCommand } from "./commands/generate_test_files_commands";
import path from "path";
import { DriftTableParser } from "./feature/data/datasources/local/tables/drift_table_parser";
import { syncMetaDataTableFile } from "./feature/data/datasources/local/tables/sync_metadata_table_file";
import { sync_metadata_dao_file } from "./core/database/local/daos/sync_metadata_dao_file";
import { sync_registry_file } from "./core/sync/sync_registry_file";
import { sync_controller_provider_file } from "./core/sync/sync_controller_provider_file";
import { base_sync_repository } from "./core/sync/base_sync_repository_file";
import { database_types_file } from "./core/database/local/database_types_file";
import { sync_event_type_spy } from "./generators/sync_event_type_spy";
import { entity_sync_event_spy_file } from "./generators/entity_sync_event_spy_file";

export async function createDataFiles() {
    const driftClassCode = getDocText();
    const classParser = new DriftClassParser(driftClassCode);
    const tableParser = new DriftTableParser(driftClassCode);
    const entityName = unCap(classParser.driftClassNameUpper);

    const currentFilePath = getActiveEditorPath()!; // Путь к Drift-файлу в a3_flutter
    // Корень Flutter-проекта (например, G:\Projects\Flutter\serverpod\a3\a3_flutter)
    const flutterProjectPath = currentFilePath.split(/\Wlib\W/)[0];

    // Имя серверного проекта (например, a3_server)
    const serverProjectName = path.basename(flutterProjectPath).replace('_flutter', '_server');
    const serverProjectRoot = path.join(flutterProjectPath, '..', serverProjectName); // Корень серверного проекта

    // Путь к директории моделей в Serverpod server-модуле
    // (например, G:\Projects\Flutter\serverpod\a3\a3_server\lib\src\models)
    const serverpodModelDir = path.join(flutterProjectPath, '..', serverProjectName, 'lib', 'src', 'models');
    const serverProjectEndpointsDir = path.join(serverProjectRoot, 'lib', 'src', 'endpoints'); // Путь к эндпоинтам

    const featurePath = currentFilePath.split(/\Wdata\W/)[0]; // Для остальных генераторов Flutter
    const featureTestPath = path.join(flutterProjectPath, "test", featurePath.split('lib')[1]);

    const syncMetaDataTablePath = path.join(featurePath, "data", "datasource", "data", "local", "tables", "sync_metadata_table.dart");
    const syncMetaDataDaoPath = path.join(flutterProjectPath, "lib", "core", "database", "local", "daos", "sync_metadata_dao.dart");
    // serverpod
    const syncEventTypePath = path.join(serverProjectRoot, "lib", "src", "models", "sync_event_type.spy.yaml");
    const entitySyncEventPath = path.join(serverProjectRoot, "lib", "src", "models", `${entityName}`, `${entityName}_sync_event.spy.yaml`);
    createFileOneTime(syncEventTypePath, sync_event_type_spy);
    
    createFileOneTime(entitySyncEventPath, entity_sync_event_spy_file(entityName));

    createFileOneTime(syncMetaDataTablePath, syncMetaDataTableFile);
    createFileOneTime(syncMetaDataDaoPath, sync_metadata_dao_file);

    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();
    const generatorFactory = new GeneratorFactory(fileSystem);
    const testGeneratorFactory = new DartTestGeneratorFactory(fileSystem);

    const commandData = {
        classParser: classParser,
        tableParser: tableParser,
        isRelationTable: tableParser.isRelationTable(),
        relations: tableParser.getTableRelations(),
    };

    // Передаем serverpodModelDir в команду генерации
    const generatorCommands = new GenerateAllFilesCommand(
        generatorFactory,
        featurePath,
        entityName,
        commandData,
        serverpodModelDir,
        serverProjectEndpointsDir
    );
    const generateTestFilesCommand = new GenerateTestFilesCommand(testGeneratorFactory, featureTestPath, entityName, commandData);

    await generatorCommands.execute(); // await, если execute асинхронный
    await executeCommand("serverpod generate --experimental-features=all", serverProjectRoot);

    await generateTestFilesCommand.execute(); // await, если execute асинхронный

    await appDatabaseRoutine(currentFilePath, entityName);
    await executeInTerminal(build_runner);
}