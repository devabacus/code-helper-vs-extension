import path from 'path';
import { createFile, createFolders, executeCommand } from '../../../utils';
import { insertAtFileStart, insertTextAfter } from '../../../utils/text_work/text_insert/basic-insertion';
import { getUserInputWrapper } from '../../../utils/ui/ui_ask_folder';
import { featureNavService, featureNavServicePath, featureNavServiceProvider, featureNavServiceProviderGenPath, featureNavServiceProviderPath, featureRoutesConstants, importFeatureRouter, importFeatureRoutesConst, navServiceMethod, routerContent, routerFeatureFileContent } from './flutter_content/files_content/files_contents';
import { appRouterConfigPath, appRouterNavServicePath, baseTemplateFolders, featureFolderPaths, templatefiles } from './flutter_content/template_paths';
import { addStartPlugins } from './flutter_content/terminal_commands';
import { createIndexDartFiles } from './add_barrel_files';
import { featureMainPagePath, featureRouterConfigPath, featureRoutesConstantPath } from './flutter_content/files_content/files_paths';
import { featureMainPageContent } from './flutter_content/files_content/root_files';
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
    await createTemplFeatureContentFiles(feauturePath, featureName);
    
    createIndexDartFiles(`${feauturePath}`);

    updateAppRouterThings(featureName, rootPath);

}

export async function createTemplFeatureContentFiles(featurePath: string, featureName: string) {
    const featureConstantsFile = featureRoutesConstantPath(featurePath, featureName!);
    const featureRoutesContent = featureRoutesConstants(featureName!);
    await createFile(featureConstantsFile, featureRoutesContent);

    const featureConfigFile = featureRouterConfigPath(featurePath, featureName!);
    const featureRouterContent = routerFeatureFileContent(featureName!);
    await createFile(featureConfigFile, featureRouterContent);

    const featureMainPageFile = featureMainPagePath(featurePath, featureName!);
    const featureMainPage = featureMainPageContent(featureName!);
    await createFile(featureMainPageFile, featureMainPage);

    const featureNavServiceFile = featureNavServicePath(featurePath, featureName!);
    const featureNavServiceContent = featureNavService(featureName!);
    await createFile(featureNavServiceFile, featureNavServiceContent!);

    const featureNavServiceProviderFile = featureNavServiceProviderPath(featurePath, featureName!);
    const featureNavServiceProviderContent = featureNavServiceProvider(featureName!);
    await createFile(featureNavServiceProviderFile, featureNavServiceProviderContent!);

    const featureNavServiceProviderGenFile = featureNavServiceProviderGenPath(featurePath, featureName!);
    const featureNavServiceProviderGenContent = featureNavServiceProvider(featureName!);
    await createFile(featureNavServiceProviderGenFile, featureNavServiceProviderGenContent!);

}


function updateAppRouterThings(featureName: string | undefined, rootPath: string) {
    const appRouterFilePath = appRouterConfigPath(rootPath);
    const appNavServiceFilePath = appRouterNavServicePath(rootPath);

    insertAtFileStart(appRouterFilePath, importFeatureRouter(featureName!));
    insertAtFileStart(appNavServiceFilePath, importFeatureRoutesConst(featureName!));

    insertTextAfter(appRouterFilePath, 'routes: [', `\t\t\t...get${capitalize(featureName!)}Routes(),`);
    insertTextAfter(appNavServiceFilePath, 'class NavigationService {', navServiceMethod(featureName!));
}




