import vscode from 'vscode';
import fs from 'fs';
import { routerContent, routesContent } from './flutter_content/flutter_constants';
import path from 'path';
import { getRootWorkspaceFolders } from '../../utils/path_util';



export function createFlutterRouterFiles(rootPath: string) {

    const appRouterPath = path.join(rootPath, 'lib', 'app_router');
    const appRoutesPath = path.join(rootPath, 'lib', 'app_routes');

    // Создаём папки, если их нет
    if (!fs.existsSync(appRouterPath)) {
        fs.mkdirSync(appRouterPath);
    }
    if (!fs.existsSync(appRoutesPath)) {
        fs.mkdirSync(appRoutesPath);
    }

    

    // Создаём файлы
    const routerFilePath = path.join(appRouterPath, 'router.dart');
    const routesFilePath = path.join(appRoutesPath, 'routes.dart');


    if (!fs.existsSync(routerFilePath)) {
        fs.writeFileSync(routerFilePath, routerContent, 'utf8');
    }
    if (!fs.existsSync(routesFilePath)) {
        fs.writeFileSync(routesFilePath, routesContent, 'utf8');
    }

    vscode.window.showInformationMessage('Папки и файлы для роутинга Flutter успешно созданы!');
}


