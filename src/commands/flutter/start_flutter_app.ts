import { Uri, window, workspace } from "vscode";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";
import { addFileFromSnippetFolder } from "../../utils/file_handle";
import { terminalCommands, writeToTerminal } from "../../utils/terminal_handle";
import { insertTextInDocument } from "../../utils/insert_text";
import { startApp, startAppWithRoute } from "./flutter_content/flutter_content";
import { createFlutterRouterFiles } from "./create_folders";
import { addGoRouterPackage } from "./flutter_content/flutter_commands";
import { getRootWorkspaceFolders } from "../../utils/path_util";




const startTerminalCommands: string[] = [
    addGoRouterPackage,
];

export async function startFlutterApp() {
    baseCommand();
    insertTextInDocument(startApp);
}

export async function startFlutterAppRouter() {
    baseCommand();
    writeToTerminal(addGoRouterPackage);
    createFlutterRouterFiles(getRootWorkspaceFolders());
    insertTextInDocument(startAppWithRoute);
}

export async function baseCommand() {
    await fixAndroidNDKVersion();
    addFileFromSnippetFolder("flutter_handle.ps1");
}


// const startContent = "new text";

