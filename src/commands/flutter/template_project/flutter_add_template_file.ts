import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { crBarrelFls } from './add_barrel_files';
import { addFeatureFolders } from './add_feature';
import { routerCont } from './navigation_files/router_config';
import { routerPath, baseTemplateFolders, templatefiles, addStartPlugins } from './flutter_content/';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map((path) => `${rootPath}/lib/${path}`);

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createFile(routerPath(rootPath), routerCont);
    addFeatureFolders(rootPath, 'home');
    crBarrelFls(`${rootPath}/lib`);
    executeCommand(addStartPlugins, rootPath);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}





