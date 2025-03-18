import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { insertAtFileStart } from '../../../utils/text_work/text_insert/basic-insertion';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { featureRoutesConstants, importFeatureRouter, routerFeatureFileContent } from '../flutter_content/files_content/files_contents';
import { appRouterConfigPath, baseTemplateFolders, featureFolderPaths, templatefiles } from '../flutter_content/template_paths';
import { addStartPlugins } from '../flutter_content/terminal_commands';
import { createIndexDartFiles } from './add_barrel_files';
import { featureMainPagePath, featureRouterConfigPath, featureRoutesConstantPath } from '../flutter_content/files_content/files_paths';
import { featureMainPageContent } from '../flutter_content/files_content/root_files';


export async function addBaseTemplate(rootPath: string) {

    const coreFolders = baseTemplateFolders.map((path) => `${rootPath}/lib/${path}`);

    await createFolders(coreFolders);
    await createTemplateFiles(rootPath);
    createIndexDartFiles(`${rootPath}/lib`);
    executeCommand(addStartPlugins, rootPath);
}

export async function createTemplateFiles(rootPath: string) {

    for (const [filePath, content] of Object.entries(templatefiles)) {
        const fullPath = path.join(rootPath, "lib", filePath);
        createFile(fullPath, content);
    }
}

export async function addFeatureFolders(rootPath: string) {

    const featureName = await getUserInputWrapper(true, "type feature name");
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

    const appRouterFilePath = appRouterConfigPath(rootPath);
    insertAtFileStart(appRouterFilePath, importFeatureRouter(featureName!));
}

