import path from "path";
import { createFile, executeCommand } from "../../utils";
import { database_cont } from "./template_project/flutter_content/drift_db_files/database_dart";
import { build_runner, pubAddComm } from "./template_project/flutter_content/terminal_commands";
import { dbProvider } from "./template_project/flutter_content/drift_db_files/database_provider";
import { db_provider_g } from "./template_project/flutter_content/drift_db_files/database_provider_g";
import { database_g_cont } from "./template_project/flutter_content/drift_db_files/database_g_dart";


export async function addDriftDB(rootPath: string): Promise<void> {
    const command = `${pubAddComm}drift drift_flutter dev:drift_dev`;
    const dbPath = path.join(rootPath, "lib", "core", "database");


    const database_dart_path = path.join(dbPath, "database.dart");
    const database_g_dart_path = path.join(dbPath, "database.g.dart");
    const database_provider_path = path.join(dbPath, "database_provider.dart");
    const database_provider_g_path = path.join(dbPath, "database_provider.g.dart");

    await executeCommand(command, rootPath);

    await createFile(database_dart_path, database_cont(path.basename(rootPath)));
    await createFile(database_g_dart_path, database_g_cont());
    await createFile(database_provider_path, dbProvider);
    await createFile(database_provider_g_path, db_provider_g);


}

