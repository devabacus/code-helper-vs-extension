import fs from 'fs';
import path from 'path';
import vscode from 'vscode';
import { createFile, createFolder, createFolders, getFilesInDir } from '../../utils';
import { home_page, routerConfigGenerator, routerContent, routesContent } from './flutter_content/flutter_constants';
import { getUserInputWrapper } from '../../utils/ui/ui_ask_folder';
import { createIndexDartFiles } from './add_barrel_files';

const coreFolderPaths = [
    'core/routing',
    'core/config',
    'core/providers',
    'core/services',
    'core/theme',
    'core/utils',
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

export async function addBaseTemplate(rootPath: string) {

    // const coreFolders = createFullTemplatePaths(rootPath, 'core', coreFolderPaths);

    const coreFolders = coreFolderPaths.map(function(path){
      return `${rootPath}/lib/${path}`;
    });

    await createFolders(coreFolders);
    createIndexDartFiles(`${rootPath}/lib`);
}

export async function addFeatureFolders(rootPath: string) {

    const featureName = await getUserInputWrapper(true, "type feature name");
    const featureFolders = createFullTemplatePaths(rootPath, `features/${featureName}`, featureFolderPaths);
    await createFolders(featureFolders);

    createIndexDartFiles(`${rootPath}/lib/features/${featureName}`);

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


