

export interface FileSystem{
    createFile(path: string, content: string): Promise<void>;
    createFolder(path: string): Promise<void>;
}

