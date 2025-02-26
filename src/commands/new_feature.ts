import { mkdirp } from "mkdirp";
import { Uri, window, workspace, commands, ExtensionContext, OpenDialogOptions } from "vscode";
import { createDirectory, createDirs, getUserInput, pickPath } from "../utils/create_dir_handle";



export async function newFeature() {
    // Запрос текста у пользователя
    

    let folderPaths = [
        'data/datasources',
        'data/repositories',
        'domain/entries',
        'domain/repositories',
        'domain/usecases',
        'presentadion/bloc',
        'presentadion/pages',
        'presentadion/widgets',
    ];
    
    createDirs(folderPaths);

}



