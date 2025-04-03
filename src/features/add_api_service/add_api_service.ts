import { cap, createFile, getActiveEditorPath, getRootWorkspaceFolders, insAtFlStart, insertTextAfter, unCap } from "@utils";
import path from "path";
import { feat_api_service } from "./files/feat_api_service";


export async function addApiService(filePath: string): Promise<void> {

    const curFilePath = getActiveEditorPath()!;

    const fileName = path.parse(curFilePath).name;

    const serviceName = fileName.split('_').map((item) => cap(item)).join('');
    const featApiServFlCont = feat_api_service(serviceName, fileName);

    const api_client_path = path.join(getRootWorkspaceFolders(), "lib", "core/services/api/api_client.dart");

    const serviceGetter = `${serviceName} get ${unCap(serviceName)} => _client.getService<${serviceName}>();`;

    insertTextAfter(api_client_path, 'services: [', `${serviceName}.create(),`);

    insertTextAfter(api_client_path, 'ApiClient(this._client);', serviceGetter);
    const _path1 = filePath.split('features')[1];
    const _importPath = _path1.replace(/\\/g, '/');
    const importPath = `import '../../../features${_importPath}';\n`;

    insAtFlStart(api_client_path, `${importPath}`);

    createFile(filePath, featApiServFlCont);


}


