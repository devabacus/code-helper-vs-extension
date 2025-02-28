import { Uri, window, workspace } from "vscode";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";
import { copyFromSnippets } from "../file_helper";
import { terminalCommands, writeToTerminal } from "../../utils/terminal_handle";
import { insertText } from "../../utils/insert_text";
import { startContent } from "../flutter/flutter_content";
import { flutterCreate } from "./flutter_create_command";


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
}

export async function baseCommand() {
    await fixAndroidNDKVersion();
    copyFromSnippets("flutter_handle.ps1");
    insertText(startContent);
}





// const startContent = "new text";

