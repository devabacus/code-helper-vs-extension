import { window } from "vscode";
import { addBLePackage } from "./add_ble_package";
import { createFlutterPackage } from "./create_package";
import { startFlutterApp, startFlutterAppRouter } from "./start_flutter_app";




export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'Старт': startFlutterApp,
        'Старт c router': startFlutterAppRouter,
        
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}


// export async function ${1:fname}()${2: : Promise<${3:void}>} {
//     ${4:}
// }
