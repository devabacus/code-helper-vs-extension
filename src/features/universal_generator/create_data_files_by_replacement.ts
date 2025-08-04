import { ServiceLocator } from "../../core/services/service_locator";
import { getRootWorkspaceFolders } from "../../utils/path_util";
import { pickPath } from "../../utils/ui/ui_ask_folder";
import { getDocText } from "../../utils/ui/ui_util";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";
import { GenerationService } from "./generators/generation_service";
import { manifestType } from "./generators/manifests";
import { GenerationConfig } from "./paths/generation_config";
import { ServerpodYamlParser } from "./serverpod_yaml_parser/server_yaml_parser";

export async function createDataFilesByReplacement() {

    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    const model = ServerpodYamlParser.parse(getDocText());
    const features: manifestType[] = model.isRelation ? ['manyToMany'] : ['entity'];

    const workspacePath = getRootWorkspaceFolders();

    const config = new GenerationConfig({
        templProject: 't2',
        workspacesPath: workspacePath,
        templFeatureName: 'home',
        targetFeaturePath: 'configuration',
        targetEntity: model.tableName,
        targetEntity1: model.entity1,
        targetEntity2: model.entity2,
        // features: ['startProject']
        manifest: features
    });

    const featurePath = await pickPath("Выберите feature", config.featuresPath);
    if (featurePath) {
        config.targetFeaturePath = featurePath;
    } else { return; }

    const generationService = new GenerationService(fileSystem);
    await generationService.generate(config, model);
    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, config);
    await appDatabaseGenerator.generate();
}