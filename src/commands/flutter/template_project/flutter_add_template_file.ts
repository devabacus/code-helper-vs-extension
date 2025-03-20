import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { createIndexDartFiles } from './add_barrel_files';
import { addFeatureFolders } from './add_feature';
import { } from './navigation_files/constants/nav_service_prov_get';
import { routerPath, baseTemplateFolders, templatefiles } from './flutter_content/template_paths';
import { addStartPlugins } from './flutter_content/terminal_commands';
import { routerCont } from './navigation_files/router_config';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map((path) => `${rootPath}/lib/${path}`);

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createFile(routerPath(rootPath), routerCont);
    addFeatureFolders(rootPath, 'home');
    createIndexDartFiles(`${rootPath}/lib`);
    executeCommand(addStartPlugins, rootPath);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}





