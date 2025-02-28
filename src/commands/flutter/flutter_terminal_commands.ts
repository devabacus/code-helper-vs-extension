import { Uri, window, workspace } from "vscode";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";
import { copyFromSnippets } from "../file_helper";


const addGoRouterPackage = "flutter pub add go_router";




const startTerminalCommands:string[] = [
    addGoRouterPackage,
]


