import fs from 'fs';
import path from 'path';


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

export async function createFile(mpath: string, content: string) {
    if (!fs.existsSync(path.dirname(mpath))) {
        await fs.promises.mkdir(path.dirname(mpath), { recursive: true });
    }
    await fs.promises.writeFile(mpath, content, 'utf8');
}

export async function getFilesInDir(path: string): Promise<string[]>{
   return await fs.promises.readdir(path);
        }
