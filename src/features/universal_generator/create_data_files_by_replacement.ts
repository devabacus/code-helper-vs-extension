import { getDocText } from "../../utils/ui/ui_util";
// import { addProviderFiles } from "./add_providers";
import { ServiceLocator } from "../../core/services/service_locator";
import { GeneratorConfig } from "../universal_generator/generator_config";
import { StaticFileGenerator } from "./generators/static_files_generator";
import { UniversalFileGenerator } from "./generators/universal_file_generator";
import { CodeFormatter } from "../data_routine/serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodYamlParser } from "../data_routine/serverpod_yaml_parser/server_yaml_parser";
import { ProjectConfGenerator } from "./generators/project_name_generator";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";
import { DefaultProjectStructure } from "./project_structure/impl/default_project_structure";
import { DefaultWorkspaceStructure } from "./project_structure/impl/default_workspace_structure";

export async function createDataFilesByReplacement() {

    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    const config = new GeneratorConfig({
        templProject: 't2',
        targetProject: 't3',
        featureName: 'home',
    });

    // const baseStructure = new DefaultProjectStructure(config.getFeaturePath);
    const workspace = new DefaultWorkspaceStructure(config.targetFlutterRootPath, config.featureName);

    const codeFormatter = new CodeFormatter();
    const model = ServerpodYamlParser.parse(getDocText());

   

    const staticGenerator = new StaticFileGenerator(fileSystem, config);
    staticGenerator.generate();

    const projectNameGenerator = new ProjectConfGenerator(fileSystem, config);
    projectNameGenerator.generate();

    const generator = new UniversalFileGenerator(fileSystem, codeFormatter, config);
    await generator.generateAll(model);

    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, workspace);
    await appDatabaseGenerator.generate();
}