import { Uri, window, workspace } from "vscode";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";
import { addFileFromSnippetFolder } from "../../utils/file_handle";
import { terminalCommands, writeToTerminal } from "../../utils/terminal_handle";
import { insertText } from "../../utils/insert_text";
import { startContent } from "../flutter/flutter_content";
import { flutterCreate } from "./flutter_create_command";
import { createFlutterRouterFiles } from "./create_folders";


const addGoRouterPackage = "flutter pub add go_router";

const startTerminalCommands: string[] = [
    addGoRouterPackage,

];

export async function startFlutterApp() {
    baseCommand();
}

export async function startFlutterAppRouter() {
    baseCommand();
    writeToTerminal(addGoRouterPackage);
    createFlutterRouterFiles();
}

export async function baseCommand() {
    await fixAndroidNDKVersion();
    addFileFromSnippetFolder("flutter_handle.ps1");
    insertText(startContent);
}


// const startContent = "new text";

