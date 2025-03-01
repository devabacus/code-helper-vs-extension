import { window } from "vscode";
import { createFlutterPackage } from "./flutter_create_package";
import { addBLePackage } from "./add_ble_package";
import { startFlutterApp, startFlutterAppRouter } from "./start_flutter_app";
import { flutterCreateNewProject } from "./flutter_create_command";




export async function flutterHandler() {
    const options: { [key: string]: () => Promise<void> } = {
        'Создать Flutter пакет': createFlutterPackage,
        'Добавить ble': addBLePackage,
        'Старт': startFlutterApp,
        'Старт c router': startFlutterAppRouter,
        'Новый проект' : flutterCreateNewProject
        // 'Добавить feature' : 
        
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
