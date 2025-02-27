import { Uri, window, workspace } from "vscode";
import { createFlutterPackage } from "./create_package";
import { addBLePackage } from "./add_ble_package";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";



export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'fix android ndk version': fixAndroidNDKVersion,
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}
