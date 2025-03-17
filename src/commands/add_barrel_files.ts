import * as fs from "fs";
import * as path from "path";
import { barrelFiles } from "./flutter/flutter_content/flutter_constants";





function createBarrelFiles(rootPath: string, folders: string[]) {


    for (const folder of folders) {
        const folderPath = path.join(rootPath, folder);
        console.log(`Проверка папки: ${folderPath}, существует: ${fs.existsSync(folderPath)}`);

        if (!fs.existsSync(folderPath)) {
            continue;
        }

        const barrelFileName = barrelFiles[folder];
        if (barrelFileName) {
            const filePath = path.join(folderPath, barrelFileName);
            if (!fs.existsSync(filePath)) {
                fs.writeFileSync(filePath, `// ${barrelFileName} - файл для экспорта всех модулей\n`, "utf8");
            }
        }
    }
}