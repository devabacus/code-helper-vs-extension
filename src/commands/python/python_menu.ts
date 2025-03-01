import { window } from "vscode";
import { addFileFromSnippetFolder } from "../../utils/file_handle";

export async function pythonHandler() {
    const options: { [key: string]: () => Promise<void> } = {

        'Старт': startProject,
    };

    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}


export async function startProject() {
    addFileFromSnippetFolder("python_handle.ps1"),
        addFileFromSnippetFolder("main.py");
}
