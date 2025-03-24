import path from "path";
import { database_cont } from "./database_dart";
import { database_g_cont } from "./database_g_dart";
import { dbProvider } from "./database_provider";
import { db_provider_g } from "./database_provider_g";
import { pubAddComm } from "../terminal_commands";
import { createFile, executeCommand } from "../../../../../utils";


export async function addDriftDB(rootPath: string): Promise<void> {
    const command = `${pubAddComm}drift drift_flutter dev:drift_dev`;
    const dbPath = path.join(rootPath, "lib", "core", "database");


    const database_dart_path = path.join(dbPath, "database.dart");
    const database_g_dart_path = path.join(dbPath, "database.g.dart");
    const database_provider_path = path.join(dbPath, "database_provider.dart");
    const database_provider_g_path = path.join(dbPath, "database_provider.g.dart");

    // await executeCommand(command, rootPath);

    await createFile(database_dart_path, database_cont(path.basename(rootPath)));
    await createFile(database_g_dart_path, database_g_cont());
    await createFile(database_provider_path, dbProvider);
    await createFile(database_provider_g_path, db_provider_g);
}

