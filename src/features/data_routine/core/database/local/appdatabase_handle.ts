import path from "path";
import { database_cont } from "./database_dart";
import { databaseProvPath, dbProvider } from "./database_provider";
import { appDatabasePath, imAppDatabase } from "./app_database_file_dart";
import * as fs from 'fs';
import { build_runner } from "../../../../template_project/flutter_content/terminal_commands";
import { PathData } from "../../../../../flutter_utils/path_util";
import { createFile, executeInTerminal } from "@utils";
import { cap, textGroupReplacer } from "@utils";




export async function appDatabaseRoutine(currentFilePath: string, driftClassName: string) {
    const pathData = new PathData(currentFilePath).data;
    const appDatabaseP = appDatabasePath(pathData.rootPath);

    if (!fs.existsSync(appDatabaseP)) {
        await createFile(appDatabaseP, database_cont(path.basename(pathData.rootPath)));
        await createFile(databaseProvPath(pathData.rootPath), dbProvider);
    }

    const content = fs.readFileSync(appDatabaseP, { encoding: "utf-8" });
    const newContent = textGroupReplacer(content, /tables: \[(.*)\]/g, `${cap(driftClassName)}Table`);

    const contWithImport = imAppDatabase(pathData.featName, driftClassName) + newContent;
    fs.writeFileSync(appDatabaseP, contWithImport, { encoding: "utf-8" });

    await executeInTerminal(build_runner);
}
