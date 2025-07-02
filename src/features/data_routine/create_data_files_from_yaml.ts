import { createFileOneTime, executeInTerminal } from "../../utils";
import { getActiveEditorPath } from "../../utils/path_util";
import { unCap } from "../../utils/text_work/text_util";
import { getDocText } from "../../utils/ui/ui_util";
// import { addProviderFiles } from "./add_providers";
import path from "path";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerateAllFilesCommandYaml } from "./commands/generate_all_files_command_yaml";
import { appDatabaseRoutine } from './core/database/local/appdatabase_handle';
import { sync_metadata_dao_file } from "./core/database/local/daos/sync_metadata_dao_file";
import { sync_metadata_local_datasource_service_file } from "./core/database/local/interfaces/sync_metadata_local_datasource_service_file";
import { sync_metadata_local_datasource_file } from "./core/database/local/sources/sync_metadata_local_data_source_file";
import { GeneratorFactory } from "./factories/generator_factory";
import { DartTestGeneratorFactory } from "./factories/test_generator_factory";
import { entity_sync_event_spy_file } from "./generators/entity_sync_event_spy_file";
import { ServerpodEndpointGenerator } from "./generators/serverpod_endpoint_generator";
import { sync_event_type_spy } from "./generators/sync_event_type_spy";
import { sync_metadata_table_file } from "./generators/sync_metadata_table";
import { ServerpodYamlParser } from "./serverpod_yaml_parser/server_yaml_parser";
import { EndpointRelateGenerator } from "./generators/endpoint_relate_generator";
import { build_runner } from "../template_project/flutter_content/terminal_commands";

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
    

    const isRelationTable = model.fields.every(field => field.isRelation);
    if (isRelationTable) {

    const endpointRelateGenerator = new EndpointRelateGenerator(fileSystem);
    await endpointRelateGenerator.generate(serverProjectRoot, model);
    }
    // TODO раскомментировать
    // executeInTerminal(SERVERPOD_GENERATE, serverProjectRoot);

    const generatorCommands = new GenerateAllFilesCommandYaml(
        generatorFactory,
        featurePath,
        model,
    );

    await generatorCommands.execute();
    await appDatabaseRoutine(featurePath, entityName);
    // await executeInTerminal(build_runner, flutterDirPath);
}