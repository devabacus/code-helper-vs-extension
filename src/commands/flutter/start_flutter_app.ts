import { Uri, window, workspace } from "vscode";
import { fixAndroidNDKVersion } from "./fix_android_ndk_version";
import { copyFromSnippets } from "../file_helper";

export async function startFlutterApp() {
    await fixAndroidNDKVersion();
    await copyFromSnippets("flutter_handle.ps1");
}