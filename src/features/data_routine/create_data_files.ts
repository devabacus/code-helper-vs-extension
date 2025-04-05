import { createFile, executeInTerminal } from "../../utils";
import { getActiveEditorPath } from "../../utils/path_util";
import { unCap } from "../../utils/text_work/text_util";
import { getDocText } from "../../utils/ui/ui_util";
import { build_runner } from "../template_project/flutter_content/terminal_commands";
// import { addProviderFiles } from "./add_providers";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerateAllFilesCommand } from "./commands/generate_all_files_command";
import { appDatabaseRoutine } from './core/database/local/appdatabase_handle';
import { GeneratorFactory } from "./factories/generator_factory";
import { daoLocalContent, daoPath } from "./feature/data/datasources/local/dao/data_local_dao_dart";
import { localDataSourceCont, localDataSourcePath } from "./feature/data/datasources/local/sources/local_data_source_dart";
import { DriftClassParser } from "./feature/data/datasources/local/tables/drift_class_parser";
import { dataModelCont, dataModelPath } from "./feature/data/models/data_model_dart";
import { addUseCases } from "./feature/domain/usecases/add_usecases";

export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const fields = parser;
    const driftClassName = unCap(parser.driftClassNameUpper);
    const currentFilePath = getActiveEditorPath()!;
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];


    // получаем файловую систему через ServiceLocator
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();

    const generatorFactory = new GeneratorFactory(fileSystem);

    const generatorCommands = new GenerateAllFilesCommand(generatorFactory,featurePath,driftClassName,parser);
    
    generatorCommands.execute();

    // appdatabase routine
    await appDatabaseRoutine(currentFilePath, driftClassName);


    // usecases files
    await addUseCases(featurePath, driftClassName);

    // data layer
    const modelPath = dataModelPath(featurePath, driftClassName);
    const modelContent = dataModelCont(driftClassName, fields.fieldsRequired);
    await createFile(modelPath, modelContent);

    const _daoPath = daoPath(featurePath, driftClassName);
    const daoContent = daoLocalContent(driftClassName);
    await createFile(_daoPath, daoContent);

    const localPath = localDataSourcePath(featurePath, driftClassName);
    const localContent = localDataSourceCont(parser);
    await createFile(localPath, localContent);

    // providers files for all layers

    const providerGenerator = serviceLocator.getProviderFilesGenerator();
    providerGenerator.addProviderFiles(featurePath, driftClassName);

    // await addProviderFiles(featurePath, driftClassName);
    await executeInTerminal(build_runner);
}
