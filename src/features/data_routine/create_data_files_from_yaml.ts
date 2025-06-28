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
import { ServerpodYamlParser } from "./serverpod_yaml_parser/parser";
import { ServerpodEndpointGenerator } from "./generators/serverpod_endpoint_generator";
import { SERVERPOD_GENERATE } from "../serverpod/commands";
import { pickPath } from "../../utils/ui/ui_ask_folder";
import { DriftTableGenerator } from "./feature/data/datasources/local/tables/drift_table_generator";
import { DataDaoGenerator } from "./feature/data/datasources/local/dao/data_local_dao_generator";
import { appDatabasePath } from "./core/database/local/app_database_file_dart";
import { sync_metadata_table_file } from "./generators/sync_metadata_table";
import { GenerateAllFilesCommandYaml } from "./commands/generate_all_files_command_yaml";
import { DataLocalSourcesGenerator } from "./feature/data/datasources/local/sources/local_data_source_generator";
import { sync_metadata_local_datasource_service_file } from "./core/database/local/interfaces/sync_metadata_local_datasource_service_file";
import { sync_metadata_local_datasource_file } from "./core/database/local/sources/sync_metadata_local_data_source_file";

export async function createDataFilesFromYaml() {

    const currentFilePath = getActiveEditorPath()!;
    const rootProjectPath = currentFilePath.split(/\w*_server/)[0];
    const projectName = path.basename(rootProjectPath);
    const flutterDirPath = path.join(rootProjectPath, `${projectName}_flutter`,);
    const featureSPath = path.join(flutterDirPath, "lib", "features");
    const featurePath = path.join(flutterDirPath, "lib", "features", "home"); //TODO  временно для отладки

    const serverProjectRoot = currentFilePath.split(/\Wlib\W/)[0];

    // TODO нужно будет раскомментировать после отладки
    // const featurePath = await pickPath("Выберите feature", featureSPath);
    //     if (!featurePath) {
    //         return;
    //     }    

    const serverpodYamlModel = getDocText();
    const model = ServerpodYamlParser.parse(serverpodYamlModel);
    const entityNameCap = model.className;
    const entityName = unCap(model.className);

    const syncEventTypePath = path.join(serverProjectRoot, "lib", "src", "models", "sync_event_type.spy.yaml");
    const entitySyncEventPath = path.join(serverProjectRoot, "lib", "src", "models", `${entityName}_sync_event.spy.yaml`);
    const syncMetaDataTablePath = path.join(flutterDirPath, "lib", "core", "database", "local", "tables", "sync_metadata_table.dart");
    const syncMetaDataDaoPath = path.join(flutterDirPath, "lib", "core", "database", "local", "daos", "sync_metadata_dao.dart");
    const syncMetaDataInterfacePath = path.join(flutterDirPath, "lib", "core", "database", "local", "interface", "sync_metadata_local_datasource_service.dart");
    const syncMetaDataSourcePath = path.join(flutterDirPath, "lib", "core", "database", "local", "sources", "sync_metadata_local_data_source.dart");


    createFileOneTime(syncEventTypePath, sync_event_type_spy);
    createFileOneTime(entitySyncEventPath, entity_sync_event_spy_file(entityName));
    createFileOneTime(syncMetaDataTablePath, sync_metadata_table_file);
    createFileOneTime(syncMetaDataDaoPath, sync_metadata_dao_file);
    createFileOneTime(syncMetaDataInterfacePath, sync_metadata_local_datasource_service_file);
    createFileOneTime(syncMetaDataSourcePath, sync_metadata_local_datasource_file);

    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();
    const generatorFactory = new GeneratorFactory(fileSystem);
    const testGeneratorFactory = new DartTestGeneratorFactory(fileSystem);

    const serverpodEndpointGenerator = new ServerpodEndpointGenerator(fileSystem);
    await serverpodEndpointGenerator.generate(serverProjectRoot, model);

    // TODO раскомментировать
    // executeInTerminal(SERVERPOD_GENERATE, serverProjectRoot);

    // const driftTableGenerator = new DriftTableGenerator(fileSystem);
    // await driftTableGenerator.generate(featurePath, entityName, model);

    // const dataDaoGenerator = new DataDaoGenerator(fileSystem);
    // await dataDaoGenerator.generate(featurePath, entityName, model);

    const generatorCommands = new GenerateAllFilesCommandYaml(
        generatorFactory,
        featurePath,
        model,
    );

    await generatorCommands.execute();
    await appDatabaseRoutine(featurePath, entityName);
    await executeInTerminal(build_runner, flutterDirPath);
}