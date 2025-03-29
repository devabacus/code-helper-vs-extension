import { createFile } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { unCap } from "../../../utils/text_work/text_util";
import { getDocText } from "../../../utils/ui/ui_util";
import { DriftClassParser } from "./drift_class_parser";
import { dataModelCont, dataModelPath } from "./files/data_model_dart";
import { domainEntityCont, domainEntityPath } from "./files/domain_entity_dart";
import { domainRepoCont, domainRepoPath } from "./files/domain_repository_dart";



export async function createDataFiles() {
    const driftClass = getDocText();
    const parser = new DriftClassParser(driftClass);
    const fields = parser;
    const driftClassName = unCap(parser.tableName);

    // const pathData = new PathData().data;
    const currentFilePath = getActiveEditorPath()!;
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

    console.log(fields, driftClassName);

}




class DataClassCreated {
    private parser: DriftClassParser;

    constructor(parser: DriftClassParser) {
        this.parser = parser;
    }



}
