// src/processors/StaticFileProcessor.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';

export interface StaticCopyTask {
  sourcePath: string;
  destinationPath: string;
}
export class StaticFileProcessor {

constructor(private fileSystem: IFileSystem) {}

  public async process(tasks: StaticCopyTask[]): Promise<void> {

    const copyPromises = tasks.map(task =>
      this.fileSystem.copyFile(task.sourcePath, task.destinationPath)
    );
    await Promise.all(copyPromises);
  }
}

