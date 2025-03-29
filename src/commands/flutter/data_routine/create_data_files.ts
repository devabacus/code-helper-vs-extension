import { createFile, createFolder } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { insAtFlStart, insertTextAfter } from "../../../utils/text_work/text_insert/basic-insertion";
import { cap, unCap } from "../../../utils/text_work/text_util";
import { getDocText } from "../../../utils/ui/ui_util";
import { PathData } from "../utils/path_util";
import { DriftClassParser } from "./drift_class_parser";
import { appDatabasePath, imAppDatabase } from "./files/app_database_file_dart";
import { daoLocalContent, daoPath } from "./files/data_local_dao_dart";
import { dataModelCont, dataModelPath } from "./files/data_model_dart";
import { domainEntityCont, domainEntityPath } from "./files/entity";
import { domainRepoCont, domainRepoPath } from "./files/domain_repository_dart";
import { localDataSourceCont, localDataSourcePath } from "./files/local_data_source_dart";
import * as fs from 'fs';
import { repositoryImplContent, repositoryImplPath } from "./files/repository_impl_dart";
import { useCaseCreateCont, useCaseCreatePath } from "./files/usecases/use_case_create";
import path from "path";


export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const fields = parser;
    const driftClassName = unCap(parser.driftClassName);

    const currentFilePath = getActiveEditorPath()!;
    const pathData = new PathData(currentFilePath).data;
    // return this.filePath.split('features')[1].split('\\')[1];
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];

    const domainFilePath = domainRepoPath(featurePath, driftClassName);
    const domainFileContent = domainRepoCont(driftClassName);
    createFile(domainFilePath, domainFileContent);

    const entityPath = domainEntityPath(featurePath, driftClassName);
    const entityContent = domainEntityCont(parser);
    createFile(entityPath, entityContent);

    const modelPath = dataModelPath(featurePath, driftClassName);
    const modelContent = dataModelCont(driftClassName, fields.fieldsRequired);
    createFile(modelPath, modelContent);

    const _daoPath = daoPath(featurePath, driftClassName);
    const daoContent = daoLocalContent(driftClassName);
    createFile(_daoPath, daoContent);

    const appDatabaseP = appDatabasePath(pathData.rootPath);

    insAtFlStart(appDatabaseP, imAppDatabase(pathData.featName, driftClassName));

    const appDatabaseCont = fs.readFileSync(appDatabaseP, { encoding: "utf-8" });
    const isFirstTable = appDatabaseCont.match(/tables: \[\s*\]/);
    const _sep = isFirstTable?'':',';

    insertTextAfter(appDatabaseP, 'tables: [', `${cap(driftClassName)}Table${_sep}`);

    const localPath = localDataSourcePath(featurePath, driftClassName);
    const localContent = localDataSourceCont(parser);
    createFile(localPath, localContent);

    const repoImplPath = repositoryImplPath(featurePath, driftClassName);
    const repoImplCont = repositoryImplContent(parser);
    createFile(repoImplPath, repoImplCont);

    const _useCaseCreatePath = useCaseCreatePath(featurePath, driftClassName);
    const _useCaseCreateCont = useCaseCreateCont(driftClassName);
    
    createFolder(path.dirname(_useCaseCreatePath));

    createFile(_useCaseCreatePath, _useCaseCreateCont);
    
}









class DataClassCreated {
    private parser: DriftClassParser;

    constructor(parser: DriftClassParser) {
        this.parser = parser;
    }



}
