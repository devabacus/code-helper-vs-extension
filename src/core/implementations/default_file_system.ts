import { copyFile as utilCopyFile, fileExists, readFile, createFile as utilCreateFile, createFolder as utilCreateFolder } from "../../utils";
import { IFileSystem } from "../interfaces/file_system";

export class DefaultFileSystem implements IFileSystem {
  
  async copyFile(pathSource: string, pathDest: string): Promise<void> {
    utilCopyFile(pathSource, pathDest);
  }

  async createFile(path: string, content: string): Promise<void> {
    return utilCreateFile(path, content);
  }

  async createFolder(path: string): Promise<void> {
    return utilCreateFolder(path);
  }

  async readFile(path: string): Promise<string> {
    return readFile(path);
  }

  async fileExists(path: string): Promise<boolean> {
    return fileExists(path);
  }
}

