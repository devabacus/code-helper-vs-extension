import { createFile, createFolder, executeCommand, executeCommandSync, executeInTerminal } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { insAtFlStart, insertTextAfter } from "../../../utils/text_work/text_insert/basic-insertion";
import { cap, textGroupReplacer, unCap } from "../../../utils/text_work/text_util";
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
import { useCaseDeleteCont, useCaseDeletePath } from "./files/usecases/use_case_delete";
import { build_runner } from "../template_project/flutter_content/terminal_commands";
import { useCaseUpdateCont, useCaseUpdatePath } from "./files/usecases/use_case_update";
import { useCaseGetByIdCont, useCaseGetByIdPath } from "./files/usecases/use_case_get_by_id";
import { useCaseGetAllCont, useCaseGetAllPath } from "./files/usecases/use_case_get_all";
import { database_cont } from "../template_project/drift_db/database_dart";
import { dbProvider } from "../template_project/drift_db/database_provider";
import { addProviderFiles } from "./add_providers";


export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const fields = parser;
    const driftClassName = unCap(parser.driftClassName);

    const currentFilePath = getActiveEditorPath()!;
    const pathData = new PathData(currentFilePath).data;
    // return this.filePath.split('features')[1].split('\\')[1];
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];

    const appDatabaseP = appDatabasePath(pathData.rootPath);



    const database_provider_path = path.join(pathData.rootPath, "lib", "core", "database", "local", "provider", "database_provider.dart");

    if (!fs.existsSync(appDatabaseP)) {

        await createFile(appDatabaseP, database_cont(path.basename(pathData.rootPath)));
        await createFile(database_provider_path, dbProvider);

    }

    const content = fs.readFileSync(appDatabaseP, { encoding: "utf-8" });
    const newContent = textGroupReplacer(content, /tables: \[(.*)\]/g, `${cap(driftClassName)}Table`);

    const contWithImport = imAppDatabase(pathData.featName, driftClassName) + newContent;

    fs.writeFileSync(appDatabaseP, contWithImport, { encoding: "utf-8" });

    // await new Promise(resolve => setTimeout(resolve, 2000));
    await executeInTerminal(build_runner);

    const domainFilePath = domainRepoPath(featurePath, driftClassName);
    const domainFileContent = domainRepoCont(driftClassName);
    await createFile(domainFilePath, domainFileContent);

    const entityPath = domainEntityPath(featurePath, driftClassName);
    const entityContent = domainEntityCont(parser);
    await createFile(entityPath, entityContent);

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

    const _useCaseCreatePath = useCaseCreatePath(featurePath, driftClassName);
    await createFolder(path.dirname(_useCaseCreatePath));

    const _useCaseCreateCont = useCaseCreateCont(driftClassName);
    await createFile(_useCaseCreatePath, _useCaseCreateCont);

    const _useCaseDeleteCont = useCaseDeleteCont(driftClassName);
    const _useCaseDeletePath = useCaseDeletePath(featurePath, driftClassName);
    await createFile(_useCaseDeletePath, _useCaseDeleteCont);


    const _useCaseUpdateCont = useCaseUpdateCont(driftClassName);
    const _useCaseUpdatePath = useCaseUpdatePath(featurePath, driftClassName);
    await createFile(_useCaseUpdatePath, _useCaseUpdateCont);


    const _useCaseGetByIdCont = useCaseGetByIdCont(driftClassName);
    const _useCaseGetByIdPath = useCaseGetByIdPath(featurePath, driftClassName);
    await createFile(_useCaseGetByIdPath, _useCaseGetByIdCont);

    const _useCaseGetAllCont = useCaseGetAllCont(driftClassName);
    const _useCaseGetAllPath = useCaseGetAllPath(featurePath, driftClassName);
    await createFile(_useCaseGetAllPath, _useCaseGetAllCont);
    
    await addProviderFiles(featurePath, driftClassName);
    
    await executeInTerminal(build_runner);
}









class DataClassCreated {
    private parser: DriftClassParser;

    constructor(parser: DriftClassParser) {
        this.parser = parser;
    }



}
