import fs from 'fs';


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


export async function createFile(path: string, content: string) {

    await fs.promises.writeFile(path, content, 'utf8');

}


export async function getFilesInDir(path: string): Promise<string[]>{
   
    return await fs.promises.readdir(path);

}
