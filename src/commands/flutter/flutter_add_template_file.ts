import path from 'path';
import vscode from 'vscode';
import { createFile, createFolder, createFolders } from '../../utils';
import { home_page, routerConfigGenerator, routerContent, routesContent } from './flutter_content/flutter_constants';
import { getUserInputWrapper } from '../../utils/ui/ui_ask_folder';




const coreFolderPaths = [
    'routing',
    'config',
    'providers',
    'services',
    'theme',
    'utils',
];

const featureFolderPaths = [
    'data/models',
    'data/repositories',
    'data/datasources',
    'domain/entities',
    'domain/usecases',
    'presentation/pages',
    'presentation/widgets',
    'presentation/routing',
    'presentation/providers',
];

function createFullTemplatePaths(rootPath: string, secondRoot: string, folderPaths: string[]): string[] {
    return folderPaths.map(function (path) {
        return `${rootPath}/lib/${secondRoot}/${path}`;
    });
}

export function addBaseTemplate(rootPath: string) {

    const coreFolders = createFullTemplatePaths(rootPath, 'core', coreFolderPaths);
    createFolders(coreFolders);
}

export async function addFeatureFolders(rootPath: string) {

    const featureName = await getUserInputWrapper(true, "type feature name");
    const featureFolders = createFullTemplatePaths(rootPath, `features/${featureName}`, featureFolderPaths);
    createFolders(featureFolders);
    const barrelFilePaths = featureFolders.map(function(path){
      return `${path}/index.dart`;
    });
    for (var filePath in barrelFilePaths) {
        createFile(filePath, "");
    }

    // добавить barrel файлы в каждую папку
}






export async function createTemplateFlutterFiles(rootPath: string) {

    const libPath = path.join(rootPath, 'lib');
    const appRouterPath = path.join(libPath, 'core', 'routing');
    const presentationPath = path.join(libPath, 'presentation', 'pages');



    await createFolder(appRouterPath);
    await createFolder(presentationPath);

    // Создаём файлы
    const routerFilePath = path.join(appRouterPath, 'router_config.dart');
    const routeGenerateFilePath = path.join(appRouterPath, 'router_config.g.dart');
    const routesFilePath = path.join(appRouterPath, 'routes_constants.dart');
    const homeFilePath = path.join(presentationPath, 'home_page.dart');

    createFile(routerFilePath, routerContent);
    createFile(routesFilePath, routesContent);
    createFile(routeGenerateFilePath, routerConfigGenerator);
    createFile(homeFilePath, home_page);

    vscode.window.showInformationMessage('Папки и файлы для роутинга Flutter успешно созданы!');
}


