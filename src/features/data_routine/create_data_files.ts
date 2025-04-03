import { createFile, executeInTerminal } from "../../utils";
import { getActiveEditorPath } from "../../utils/path_util";
import { unCap } from "../../utils/text_work/text_util";
import { getDocText } from "../../utils/ui/ui_util";
import { build_runner } from "../template_project/flutter_content/terminal_commands";
import { addProviderFiles } from "./add_providers";
import { addUseCases } from "./feature/domain/usecases/add_usecases";
import { appDatabaseRoutine } from './core/database/local/appdatabase_handle';
import { DriftClassParser } from "./feature/data/datasources/local/tables/drift_class_parser";
import { dataModelCont, dataModelPath } from "./feature/data/models/data_model_dart";
import { localDataSourceCont, localDataSourcePath } from "./feature/data/datasources/local/sources/local_data_source_dart";
import { repositoryImplContent, repositoryImplPath } from "./feature/data/repositories/repository_impl_dart";
import { domainRepoCont, domainRepoPath } from "./feature/domain/repositories/domain_repository_dart";
import { domainEntityCont, domainEntityPath } from "./entity/entity";
import { daoLocalContent, daoPath } from "./feature/data/datasources/local/dao/data_local_dao_dart";


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
