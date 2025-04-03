import path from "path";


export const imAppDatabase = (fName: string, driftClassName: string) => `import '../../../features/${fName}/data/datasources/local/tables/${driftClassName}_table.dart';\n`;

export const appDatabasePath = (rootPath: string) => path.join(rootPath, "lib", "core", "database", "local", "database.dart");