import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from './add_barrel_files';
import { baseTemplateFolders, featureFolderPaths, templatefiles } from '../flutter_content/template_paths';
import { addStartPlugins } from '../flutter_content/terminal_commands';
import { routerFeature } from '../flutter_content/files_content/routers_contents';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map(function (path) {
        return `${rootPath}/lib/${path}`;
    });

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    await createIndexDartFiles(`${rootPath}/lib`);
    await executeCommand(addStartPlugins, rootPath);
}

export async function addFeatureFolders(rootPath: string) {

    const featureName = await getUserInputWrapper(true, "type feature name");
    const feauturePath = `${rootPath}/lib/features/${featureName}`;

    const featureFolders = featureFolderPaths.map(function (path) {
        return `${feauturePath}/${path}`;
    });

    await createFolders(featureFolders);
    await createFile(`${feauturePath}/presentation/routing/${featureName}_router.dart`, routerFeature);
    createIndexDartFiles(`${feauturePath}`);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}



