import path from "path";
import fs from "fs";
import { executeCommand } from "../../utils";
import { createFlutterRouterFiles } from "./create_folders";
import { addGoRouterPackage } from "./flutter_content/flutter_commands";
import { startAppWithRoute } from "./flutter_content/flutter_content";




export async function addRouterToProject(fullProjectPath: string) {
    await executeCommand(addGoRouterPackage, fullProjectPath);
    createFlutterRouterFiles(fullProjectPath);
    fs.writeFileSync(path.join(fullProjectPath, "lib", "main.dart"), startAppWithRoute, { encoding: "utf-8" });
}
