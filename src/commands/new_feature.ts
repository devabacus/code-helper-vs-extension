import { mkdirp } from "mkdirp";
import { Uri, window, workspace } from "vscode";
import * as fs from "fs";
import * as path from "path";

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

    // Запрашиваем у пользователя путь, где создать папки (однократный вызов)
    const selectedUri = await window.showOpenDialog({
        canSelectFolders: true,
        canSelectFiles: false,
        canSelectMany: false,
        openLabel: "Выберите директорию для создания папок"
    });

    if (!selectedUri || selectedUri.length === 0) return;

    const basePath = selectedUri[0].fsPath;

    // Создаём папки
    for (const folder of selectedFolders) {
        const fullPath = path.join(basePath, folder);
        try {
            if (!fs.existsSync(fullPath)) {
                await mkdirp(fullPath);
            }
        } catch (error) {
            window.showErrorMessage(`Ошибка при создании папки: ${fullPath}`);
        }
    }

    window.showInformationMessage(`Структура папок "${selectedOption}" успешно создана.`);
}
