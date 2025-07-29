import { getDocText } from "../../utils/ui/ui_util";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerationConfig } from "./paths/generation_config";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";
import { GenerationService } from "./generators/generation_service";
import { CodeFormatter } from "./serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodYamlParser } from "./serverpod_yaml_parser/server_yaml_parser";
import { FeatureName } from "./manifests";

export async function createDataFilesByReplacement() {

    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    const codeFormatter = new CodeFormatter();
    const model = ServerpodYamlParser.parse(getDocText());
    const features: FeatureName[] = model.isRelation ? ['manyToMany'] : ['entity'];

    const config = new GenerationConfig({
        templProject: 't2',
        targetProject: 't3',
        featureName: 'home',
        targetEntity: model.tableName,
        targetEntity1: model.entity1,
        targetEntity2: model.entity2,
        // features: ['general', 'routing', 'database', 'ui', 'serverpod', 'deploy']
        features: ['general']
        // features: features

    });

    const generationService = new GenerationService(fileSystem);
    await generationService.generate(config, model);

    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, config);
    await appDatabaseGenerator.generate();
}