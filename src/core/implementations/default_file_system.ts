import { createFile as utilCreateFile, createFolder as utilCreateFolder } from "../../utils";
import { IFileSystem } from "../interfaces/file_system";

export class DefaultFileSystem implements IFileSystem {

  async createFile(path: string, content: string): Promise<void> {
    return utilCreateFile(path, content);
  }

  async createFolder(path: string): Promise<void> {
    return utilCreateFolder(path);
  }

}