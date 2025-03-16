import fs from 'fs';
import path from 'path';
import vscode from 'vscode';
import { home_page, routerConfigGenerator, routerContent, routesContent } from './flutter_content/flutter_constants';



export async function createFolder(path: string) {

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }

}

export function createFile(path: string, content: string) {

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content, 'utf8');
    }

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


