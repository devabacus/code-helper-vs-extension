import fs from 'fs';
import path from 'path';
import vscode from 'vscode';
import { routerConfigGenerator, routerContent, routesContent } from './flutter_content/flutter_constants';



export async function createFolder(path: string) {
    
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true});
    }

}

export function createFile(path: string, content: string) {
    
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content, 'utf8');
    }

}

export async function createFlutterRouterFiles(rootPath: string) {

    const appRouterPath = path.join(rootPath, 'lib', 'core', 'routing');

    await createFolder(appRouterPath);

    // Создаём файлы
    const routerFilePath = path.join(appRouterPath, 'router_config.dart');
    const routeGenerateFilePath = path.join(appRouterPath, 'router_config.g.dart');
    const routesFilePath = path.join(appRouterPath, 'routes_constants.dart');

    createFile(routerFilePath, routerContent);
    createFile(routesFilePath, routesContent);
    createFile(routeGenerateFilePath,routerConfigGenerator);

    vscode.window.showInformationMessage('Папки и файлы для роутинга Flutter успешно созданы!');
}


