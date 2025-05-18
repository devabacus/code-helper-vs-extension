import path from "path";
import { toSnakeCase } from "../../../../../utils/text_work/text_util";


// export const imAppDatabase = (fName: string, driftClassName: string) => `import '../../../features/${fName}/data/datasources/local/tables/${driftClassName}_table.dart';\n`;


export const imAppDatabase = (fName: string, entityNameToConvert: string) => {
    // Преобразуем имя сущности в snake_case для имени файла
    // toSnakeCase("taskTagMap") -> "task_tag_map"
    // toSnakeCase("category") -> "category"
    // toSnakeCase("mySQLAdapter") -> "my_sql_adapter"
    const snakeCaseFileNameBase = toSnakeCase(entityNameToConvert);
    return `import '../../../features/${fName}/data/datasources/local/tables/${snakeCaseFileNameBase}_table.dart';\n`;
};


export const appDatabasePath = (rootPath: string) => path.join(rootPath, "lib", "core", "database", "local", "database.dart");