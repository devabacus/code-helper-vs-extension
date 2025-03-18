import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { insertAtFileStart, insertTextAfter } from '../../../utils/text_work/text_insert/basic-insertion';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { featureRoutesConstants, importFeatureRouter, routerContent, routerFeatureFileContent } from '../flutter_content/files_content/files_contents';
import { appRouterConfigPath, baseTemplateFolders, featureFolderPaths, templatefiles } from '../flutter_content/template_paths';
import { addStartPlugins } from '../flutter_content/terminal_commands';
import { createIndexDartFiles } from './add_barrel_files';
import { featureMainPagePath, featureRouterConfigPath, featureRoutesConstantPath } from '../flutter_content/files_content/files_paths';
import { featureMainPageContent } from '../flutter_content/files_content/root_files';
import { capitalize } from '../../../utils/text_work/text_util';


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

export async function addFeatureFolders(rootPath: string, featureNameP: string = "") {

    let featureName = featureNameP;

    if (featureNameP === '') {
        featureName = await getUserInputWrapper(true, "type feature name") as string;
    }

    
    
    const feauturePath = `${rootPath}/lib/features/${featureName}`;
    if (featureName === 'undefined') { return; }

    const featureFolders = featureFolderPaths.map(function (path) {
        return `${feauturePath}/${path}`;
    });

    await createFolders(featureFolders);

    const featureConstantsFile = featureRoutesConstantPath(feauturePath, featureName!);
    const featureRoutesContent = featureRoutesConstants(featureName!);


    const featureConfigFile = featureRouterConfigPath(feauturePath, featureName!);
    const featureRouterContent = routerFeatureFileContent(featureName!);

    const featureMainPageFile = featureMainPagePath(feauturePath, featureName!);
    const featureMainPage = featureMainPageContent(featureName!);

    // featureMainPage
    await createFile(featureConfigFile, featureRouterContent);
    await createFile(featureConstantsFile, featureRoutesContent);
    await createFile(featureMainPageFile, featureMainPage);
    
    
    createIndexDartFiles(`${feauturePath}`);

    // обновляем router_config.dart
    updateAppRouterConfig(featureName, rootPath);

}


function updateAppRouterConfig(featureName: string | undefined, rootPath: string) {
// ...get${featureName}Routes() after routes: [
    const appRouterFilePath = appRouterConfigPath(rootPath);
    insertAtFileStart(appRouterFilePath, importFeatureRouter(featureName!));
    insertTextAfter(appRouterFilePath, 'routes: [', `\t\t\t...get${capitalize(featureName!)}Routes(),`);
}

