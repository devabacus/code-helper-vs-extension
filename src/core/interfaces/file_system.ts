
export interface IFileSystem {
    createFile(path: string, content: string): Promise<void>;
    createFolder(path: string): Promise<void>;
    readFile(path: string): Promise<string>; 
    fileExists(path: string): Promise<boolean>;
}

