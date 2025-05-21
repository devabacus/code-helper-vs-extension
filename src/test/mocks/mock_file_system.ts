import { IFileSystem } from "../../core/interfaces/file_system";


export class MockFileSystem implements IFileSystem {
    readFile(path: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    fileExists(path: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    createdFiles: Record<string, string> = {};
    createdFolders: string[] = [];

    async createFile(path: string, content: string): Promise<void> {
        this.createdFiles[path] = content;

    }
    async createFolder(path: string): Promise<void> {
        this.createdFolders.push(path);
    }

    reset(): void {
        this.createdFiles = {};
        this.createdFolders = [];
    }

}


