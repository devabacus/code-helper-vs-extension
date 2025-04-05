

export interface IFileSystem {
    createFile(path: string, content: string): Promise<void>;
    createFolder(path: string): Promise<void>;
}

