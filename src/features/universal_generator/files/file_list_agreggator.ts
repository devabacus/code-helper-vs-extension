
import { AuthFiles } from './auth_files';
import { DatabaseFiles } from './database_files';
import { GeneralFiles } from './general_files';
import { RoutingFiles } from './routing_files';

const allFileClasses = [AuthFiles, DatabaseFiles, GeneralFiles, RoutingFiles];

export class FileListAggregator {

  public get allStaticFiles(): string[] {
    return allFileClasses.flatMap(cls => cls.staticFiles);
  }

  public get allSimpleReplaceFiles(): string[] {
    return allFileClasses.flatMap(cls => cls.simpleReplaceFiles);
  }

  public get allFiles(): string[] {
    return [
      ...this.allStaticFiles,
      ...this.allSimpleReplaceFiles,
    ];
  }
}