import { mkdirp } from "mkdirp";
import { Uri, window, workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createDirs } from "../utils/create_dir_handle";

export async function addFolders() {
    // Определяем доступные наборы папок
    const folderOptions: Record<string, string[]> = {
        "Flutter New Feature": [
            'data/datasources',
            'data/repositories',
            'domain/entries',
            'domain/repositories',
            'domain/usecases',
            'presentation/bloc',
            'presentation/pages',
            'presentation/widgets',
        ],
        "Presentation Only": [
            'presentation/bloc',
            'presentation/pages',
            'presentation/widgets',
        ]
    };

    // Показываем пользователю список доступных вариантов
    const selectedOption = await window.showQuickPick(Object.keys(folderOptions), {
        placeHolder: "Выберите структуру папок"
    });

    // Если пользователь не выбрал вариант — ничего не делаем
    if (!selectedOption) return;

    // Получаем список папок, соответствующий выбору пользователя
    const selectedFolders = folderOptions[selectedOption];

    createDirs(selectedFolders, true);

    }
