import { executeInTerminal } from "../../utils";
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

export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const driftClassName = unCap(parser.driftClassNameUpper);
       const currentFilePath = getActiveEditorPath()!;
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];
    const projectPath = currentFilePath.split(/\Wlib\W/)[0];
    const featureTestPath = path.join(projectPath, "test", featurePath.split('lib')[1]);



    // получаем файловую систему через ServiceLocator
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();

    // инициализируем фабрику генераторов
    const generatorFactory = new GeneratorFactory(fileSystem);
    const testGeneratorFactory = new DartTestGeneratorFactory(fileSystem);


    // инициализируем команду "запустить генерацию всех файлов"
    const generatorCommands = new GenerateAllFilesCommand(generatorFactory, featurePath, driftClassName, parser);
    const generateTestFilesCommand = new GenerateTestFilesCommand(testGeneratorFactory, featureTestPath, driftClassName, parser);

    // запускаем генерацию
    generatorCommands.execute();

    generateTestFilesCommand.execute();

    // appdatabase routine
    await appDatabaseRoutine(currentFilePath, driftClassName);

    await executeInTerminal(build_runner);
}
