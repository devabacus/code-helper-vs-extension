import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';


export async function createFolders(folderPaths: string[], errorHandler?: (error: string) => void): Promise<void> {

    for (const dirPath of folderPaths) {
        try {
            await createFolder(dirPath);
        } catch (error) {
            errorHandler?.(String(error));
        }
    }
};

export async function createFolder(path: string) {

    if (!fs.existsSync(path)) {
        await fs.promises.mkdir(path, { recursive: true });
    }
}

export function pathExists(path: string): boolean {
   return fs.existsSync(path);
}

export async function createFileOneTime(path: string, content: string) {
   if (!fs.existsSync(path)) {
        createFile(path, content);
   }         
}

export async function copyFile(pathSource: string, pathDest: string): Promise<void> {
  try {
    const destDir = path.dirname(pathDest);
    await fsPromises.mkdir(destDir, { recursive: true });
    await fsPromises.copyFile(pathSource, pathDest);
    
  } catch (error) {
    console.error(`Ошибка при копировании файла из ${pathSource} в ${pathDest}`, error);
    // Пробрасываем ошибку, чтобы вызывающий код мог ее обработать
    throw error;
  }
}


export async function createFile(mpath: string, content: string) {
    if (!fs.existsSync(path.dirname(mpath))) {
        await fs.promises.mkdir(path.dirname(mpath), { recursive: true });
    }
    await fs.promises.writeFile(mpath, content, 'utf8');
}

export async function getFilesInDir(path: string): Promise<string[]> {
    return await fs.promises.readdir(path);
}

export async function readFile(filePath: string): Promise<string> {
    try {
        return await fs.promises.readFile(filePath, 'utf-8');
    } catch (error) {
        throw error;
    }
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}