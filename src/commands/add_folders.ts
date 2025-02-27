import { mkdirp } from "mkdirp";
import { Uri, window, workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";
import { createDirs } from "../utils/create_dir_handle";

export async function addFolders() {
    // Определяем доступные наборы папок
    const folderOptions: Record<string, string[]> = {
        "Simple Feature": [
            'bloc',
            'models',
            'view',
            'widgets',
        ],
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
    if (!selectedOption) {return;}

    // Получаем список папок, соответствующий выбору пользователя
    const selectedFolders = folderOptions[selectedOption];

    const path = await createDirs(selectedFolders);;

    if (path) {
        createBarrelFiles(path, selectedFolders);
    }

    }

    function createBarrelFiles(rootPath: string, folders: string[]) {
        const barrelFiles: Record<string, string> = {
            "models": "models.dart",
            "view": "view.dart",
            "widgets": "widgets.dart",
            "bloc": "bloc.dart",
            "data/datasources": "datasources.dart",
            "data/repositories": "repositories.dart",
            "domain/entries": "entries.dart",
            "domain/repositories": "repositories.dart",
            "domain/usecases": "usecases.dart",
            "presentation/bloc": "bloc.dart",
            "presentation/pages": "pages.dart",
            "presentation/widgets": "widgets.dart"
        };
    
        for (const folder of folders) {
            const folderPath = path.join(rootPath, folder);
            console.log(`Проверка папки: ${folderPath}, существует: ${fs.existsSync(folderPath)}`);
    
            if (!fs.existsSync(folderPath)) {
                continue;
            }
    
            const barrelFileName = barrelFiles[folder];
            if (barrelFileName) {
                const filePath = path.join(folderPath, barrelFileName);
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, `// ${barrelFileName} - файл для экспорта всех модулей\n`, "utf8");
                }
            }
        }
    }