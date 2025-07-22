import path from "path";
import { IFileSystem } from "../../../core/interfaces/file_system";


export interface ReplacementRule { from: string | RegExp; to: string; }
export interface ReplaceTask {
  sourcePath: string;
  destinationPath: string;
  rules: ReplacementRule[];
}

export class ReplacingFileProcessor {

  constructor(private fileSystem: IFileSystem) {}

  public async process(tasks: ReplaceTask[]): Promise<void> {
    const processPromises = tasks.map(task => this.processSingleFile(task));
    await Promise.all(processPromises);
  }

  private async processSingleFile(task: ReplaceTask): Promise<void> {
    await this.fileSystem.createFolder(path.dirname(task.destinationPath));

    let content = await this.fileSystem.readFile(task.sourcePath);

    for (const rule of task.rules) {
      const regex = new RegExp(rule.from, 'g');
      content = content.replace(regex, rule.to);
    }

    await this.fileSystem.createFile(task.destinationPath, content);
  }
}