import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { createIndexDartFiles } from './add_barrel_files';
import { addFeatureFolders } from './add_feature/add_feature';
import { routerContent } from './flutter_content/files_content/files_contents';
import { appRouterConfigPath, baseTemplateFolders, templatefiles } from './flutter_content/template_paths';
import { addStartPlugins } from './flutter_content/terminal_commands';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map((path) => `${rootPath}/lib/${path}`);

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createFile(appRouterConfigPath(rootPath), routerContent);
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





