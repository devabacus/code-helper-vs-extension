import { window } from "vscode";
import { addFileFromSnippetFolder } from "../file_helper";
import { writeToTerminal } from "../../utils/terminal_handle";
import { createDirectory, createDirs } from "../../utils/create_dir_handle";



const gitInit = "git init";
// const gitInit = "git init";


export async function pythonHandler() {
    const options: { [key: string]: () => Promise<void> } = {

        'Старт': startProject,

        'Добавить папки':addFolders

    };



    const choice = await window.showQuickPick(Object.keys(options), {
        placeHolder: 'Выберите действие',
    });

    if (choice && options[choice]) {
        await options[choice]();
    }
}

const selectedFolders = [
    'myproject',
    'myproject2',
];

async function addFolders() {
    createDirs(selectedFolders);
}




export async function startProject() {
    addFileFromSnippetFolder("python_handle.ps1"),
    addFileFromSnippetFolder("main.py"),
    writeToTerminal(gitInit);
    
}
