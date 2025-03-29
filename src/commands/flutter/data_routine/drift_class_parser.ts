import { createFile } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { unCap } from "../../../utils/text_work/text_util";
import { getDocText } from "../../../utils/ui/ui_util";
import { PathData } from "../utils/path_util";
import { domainRepoCont, domainRepoPath } from "./files/domain_repository_dart";



export async function createDataFiles() {
    const driftClass = getDocText();
    const pasrser = new DriftClassParser(driftClass);
    const fields = pasrser.fields;
    const driftClassName = unCap(pasrser.tableName);

    // const pathData = new PathData().data;
    const currentFilePath = getActiveEditorPath()!;
    // return this.filePath.split('features')[1].split('\\')[1];
    const featurePath = currentFilePath.split(/\Wdata\W/)[0];



    const domainFilePath = domainRepoPath(featurePath, driftClassName);
    const domainFileContent = domainRepoCont(driftClassName);

    createFile(domainFilePath, domainFileContent);
    console.log(fields, driftClassName);




}

class DataClassCreated {
    private parser: DriftClassParser;

    constructor(parser: DriftClassParser){
        this.parser = parser;
    }



}


export class DriftClassParser {

    private driftClass: string;


    constructor(driftClass: string) {
        this.driftClass = driftClass;

    }


    get tableName(): string {
        return this.driftClass.match(/\s(\w+)Table/)![1];
    }

    get fields(): any[] {
        const fieldsRegex = /(\w+)Column get (\w+)/g;
        const fields = [];
        let fieldMatch;
        while ((fieldMatch = fieldsRegex.exec(this.driftClass)) !== null) {
            fields.push({
                type: fieldMatch[1], // тип колонки (Int, Text и т.д.)
                name: fieldMatch[2]  // имя колонки (id, title и т.д.)
            });
        }
        return fields;

    }

}