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
        fs.mkdirSync(path, { recursive: true });
    }

}


export function createFile(path: string, content: string) {

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, content, 'utf8');
    }

}
