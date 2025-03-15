import path from "path";
import fs from "fs";
import { executeCommand, writeToFile } from "../../utils";
import { createFlutterRouterFiles } from "./create_folders";
import { addGoRouterPackage } from "./flutter_content/flutter_commands";
import { startApp, startAppWithRoute } from "./flutter_content/flutter_content";



const startCommands = "flutter pub add flutter_riverpod riverpod_annotation hooks_riverpod freezed_annotation json_annotation go_router talker_riverpod_logger";
const devPLugin = "flutter pub add --dev riverpod_generator build_runner custom_lint riverpod_lint freezed json_serializable";





export async function addRouterToProject(fullProjectPath: string) {
    const plugins = startCommands + "&&" + devPLugin;
    await executeCommand(plugins, fullProjectPath);
    createFlutterRouterFiles(fullProjectPath);
    writeToFile(path.join(fullProjectPath, "lib", "main.dart"), startApp);
}
