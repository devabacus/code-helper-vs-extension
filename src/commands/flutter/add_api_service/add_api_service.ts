import path from "path";
import { createFile } from "../../../utils";
import { getActiveEditorPath } from "../../../utils/path_util";
import { feat_api_service } from "./files/feat_api_service";
import { cap } from "../../../utils/text_work/text_util";


export async function addApiService(filePath: string): Promise<void> {
    
    const curFilePath = getActiveEditorPath()!;

    const fileName = path.parse(curFilePath).name;
    
    const serviceName = fileName.split('_').map((item) => cap(item)).join('');

    const featApiServFlCont = feat_api_service(serviceName, fileName);

    createFile(filePath, featApiServFlCont);
    
}


