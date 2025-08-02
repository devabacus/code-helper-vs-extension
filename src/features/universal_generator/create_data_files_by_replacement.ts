import { ServiceLocator } from "../../core/services/service_locator";
import { getDocText } from "../../utils/ui/ui_util";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";
import { GenerationService } from "./generators/generation_service";
import { FeatureName } from "./generators/manifests";
import { GenerationConfig } from "./paths/generation_config";
import { ServerpodYamlParser } from "./serverpod_yaml_parser/server_yaml_parser";

export async function createDataFilesByReplacement() {

    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    const model = ServerpodYamlParser.parse(getDocText());
    const features: FeatureName[] = model.isRelation ? ['manyToMany'] : ['entity'];

    const config = new GenerationConfig({
        templProject: 't2',
        targetProject: 't2',
        templFeatureName: 'home',
        targetFeatureName: 'configuration',
        templEntity: model.tableName,
        targetEntity: model.tableName,
        targetEntity1: model.entity1,
        targetEntity2: model.entity2,
        // features: ['startProject']
        manifestType: features
    });

    const generationService = new GenerationService(fileSystem);
    await generationService.generate(config, model);
    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, config);
    await appDatabaseGenerator.generate();
}