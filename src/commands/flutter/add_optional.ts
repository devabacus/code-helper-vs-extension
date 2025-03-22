import path from "path";
import { createFile, executeCommand } from "../../utils";
import { database_cont } from "./template_project/flutter_content/drift_db_files/database_dart";
import { pubAddComm } from "./template_project/flutter_content/terminal_commands";
import { database_g_cont } from "./template_project/flutter_content/drift_db_files/database_g_dart";


export async function addDriftDB(rootPath: string): Promise<void> {
    const command = `${pubAddComm}drift drift_flutter dev:drift_dev`;
    const dbPath = path.join(rootPath,"lib", "core", "database");
    const database_dart = path.join(dbPath, "database.dart")
    const database_g_dart = path.join(dbPath, "database.g.dart")

    executeCommand(command, rootPath);
    createFile(database_dart, database_cont(path.basename(rootPath)));
    createFile(database_g_dart, database_g_cont());

    
}

