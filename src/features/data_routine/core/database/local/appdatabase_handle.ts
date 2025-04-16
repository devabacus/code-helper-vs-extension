import path from "path";
import { database_cont } from "../../../../template_project/drift_db/database_dart";
import { appDatabasePath, imAppDatabase } from "./app_database_file_dart";
import * as fs from 'fs';
import { build_runner } from "../../../../template_project/flutter_content/terminal_commands";
import { PathData } from "../../../../utils/path_util";
import { createFile, executeInTerminal } from "../../../../../utils";
import { cap, textGroupReplacer } from "../../../../../utils/text_work/text_util";
import { DatabaseService } from "../../../../template_project/drift_db/database_service";
import { DefaultFileSystem } from "../../../../../core/implementations/default_file_system";
import { DatabaseInterface } from "../../../../template_project/drift_db/database_interface";
import { DatabaseProvider } from "../../../../template_project/drift_db/database_provider";




export async function appDatabaseRoutine(currentFilePath: string, driftClassName: string) {
    const pathData = new PathData(currentFilePath).data;
    const appDatabaseP = appDatabasePath(pathData.rootPath);
    
    if (!fs.existsSync(appDatabaseP)) {
     
        await createFile(appDatabaseP, database_cont(path.basename(pathData.rootPath)));
        
        const databaseService = new DatabaseService(new DefaultFileSystem);
        databaseService.generate(pathData.rootPath);
     
        const databaseInterface = new DatabaseInterface(new DefaultFileSystem);
        databaseInterface.generate(pathData.rootPath);
     
        const databaseProvider = new DatabaseProvider(new DefaultFileSystem);
        databaseProvider.generate(pathData.rootPath);
    }

    const content = fs.readFileSync(appDatabaseP, { encoding: "utf-8" });
    const newContent = textGroupReplacer(content, /tables: \[(.*)\]/g, `${cap(driftClassName)}Table`);

    const contWithImport = imAppDatabase(pathData.featName, driftClassName) + newContent;
    fs.writeFileSync(appDatabaseP, contWithImport, { encoding: "utf-8" });

    await executeInTerminal(build_runner);
}
