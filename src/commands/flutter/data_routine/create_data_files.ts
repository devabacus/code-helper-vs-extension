import { createFile, executeInTerminal } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { unCap } from "../../../utils/text_work/text_util";
import { getDocText } from "../../../utils/ui/ui_util";
import { build_runner } from "../template_project/flutter_content/terminal_commands";
import { addProviderFiles } from "./add_providers";
import { addUseCases } from "./add_usecases";
import { appDatabaseRoutine } from './appdatabase_handle';
import { DriftClassParser } from "./drift_class_parser";
import { daoLocalContent, daoPath } from "./files/data_local_dao_dart";
import { dataModelCont, dataModelPath } from "./files/data_model_dart";
import { domainRepoCont, domainRepoPath } from "./files/domain_repository_dart";
import { domainEntityCont, domainEntityPath } from "./files/entity";
import { localDataSourceCont, localDataSourcePath } from "./files/local_data_source_dart";
import { repositoryImplContent, repositoryImplPath } from "./files/repository_impl_dart";


export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const fields = parser;
    const driftClassName = unCap(parser.driftClassName);
    const currentFilePath = getActiveEditorPath()!;
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];

    // appdatabase routine
    await appDatabaseRoutine(currentFilePath, driftClassName);


    // domain layer
    const domainFilePath = domainRepoPath(featurePath, driftClassName);
    const domainFileContent = domainRepoCont(driftClassName);
    await createFile(domainFilePath, domainFileContent);

    const entityPath = domainEntityPath(featurePath, driftClassName);
    const entityContent = domainEntityCont(parser);
    await createFile(entityPath, entityContent);
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

    const repoImplPath = repositoryImplPath(featurePath, driftClassName);
    const repoImplCont = repositoryImplContent(parser);
    await createFile(repoImplPath, repoImplCont);

    // providers files for all layers
    await addProviderFiles(featurePath, driftClassName);
    
    await executeInTerminal(build_runner);
}
