import path from "path";
import { createFile, executeInTerminal } from "../../../../../../utils";
import { database_cont } from "../../../../template_project/drift_db/database_dart";
import { databaseProvPath, dbProvider } from "../../../../template_project/drift_db/database_provider";
import { appDatabasePath, imAppDatabase } from "./app_database_file_dart";
import { IPathHandle, PathData } from "../../../../utils/path_util";
import * as fs from 'fs';
import { cap, textGroupReplacer } from "../../../../../../utils/text_work/text_util";
import { build_runner } from "../../../../template_project/flutter_content/terminal_commands";




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
