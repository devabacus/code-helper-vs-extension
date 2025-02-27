import { Uri, window, workspace } from "vscode";
import { createFlutterPackage } from "./create_package";


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
