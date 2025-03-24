import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { addFeatureFolders } from '../add_feature/add_feature';
import { baseTemplateFolders, routerPath, templatefiles } from './flutter_content/';
import { projectFiles } from './flutter_content/template_paths';
import { pubGet } from './flutter_content/terminal_commands';
import { routerCont } from '../add_feature/files/router_config';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map((path) => `${rootPath}/lib/${path}`);

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createFile(routerPath(rootPath), routerCont);
    addFeatureFolders(rootPath, 'home');
    // crBarrelFls(`${rootPath}/lib`);
    executeCommand(pubGet, rootPath);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}


export async function createRootTemplateFiles(rootPath: string
) {
    for (const [filePath, content] of Object.entries(projectFiles)) {
        const fullPath = path.join(rootPath, filePath);
        createFile(fullPath, content);

    }
}



