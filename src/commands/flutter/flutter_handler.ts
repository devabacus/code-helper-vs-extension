import { Uri, window, workspace } from "vscode";
import { createFlutterPackage } from "./create_package";

/**
 * Функции-заглушки, которые будут заменены на реальные реализации.
 */
// async function createFlutterPackage() {
//     window.showInformationMessage('Создание Flutter пакета...');
//     // Здесь будет логика для выполнения терминальных команд
// }

async function someOtherFunction() {
    window.showInformationMessage('Запуск другой функции...');
    // Другая логика
}

/**
 * Обработчик команд, который вызывает нужную функцию в зависимости от выбора пользователя.
 */
export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Создать Flutter пакет': createFlutterPackage,
        'Другая функция': someOtherFunction,
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}
