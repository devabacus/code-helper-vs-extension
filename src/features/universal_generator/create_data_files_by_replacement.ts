import { getDocText } from "../../utils/ui/ui_util";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerationConfig } from "./generation_config";
import { CodeFormatter } from "../data_routine/serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodYamlParser } from "../data_routine/serverpod_yaml_parser/server_yaml_parser";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";
import { GenerationService } from "./generators/generation_service";

export async function createDataFilesByReplacement() {

    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    const codeFormatter = new CodeFormatter();
    const model = ServerpodYamlParser.parse(getDocText());

    const config = new GenerationConfig({
        templProject: 't2',
        targetProject: 't3',
        featureName: 'home',
        targetEntity: model.tableName,
        features: ['auth', 'general', 'routing', 'database', 'ui']
    });

    const generationService = new GenerationService(fileSystem);
    generationService.generate(config);

    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, config);
    await appDatabaseGenerator.generate();
}