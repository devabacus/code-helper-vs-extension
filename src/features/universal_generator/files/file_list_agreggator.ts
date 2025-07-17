
import { AuthFiles } from './auth_files';
import { DatabaseFiles } from './database_files';
import { GeneralFiles } from './general_files';
import { RoutingFiles } from './routing_files';
import { ServerpodFiles } from './serverpod_files';
import { UiFiles } from './ui_files';

const allFileClasses = [AuthFiles, DatabaseFiles, GeneralFiles, RoutingFiles, UiFiles];

export class FileListAggregator {

  public get allFlutterStaticFiles(): string[] {
    return allFileClasses.flatMap(cls => cls.staticFiles);
  }

  public get allSimpleReplaceFiles(): string[] {
    return allFileClasses.flatMap(cls => cls.simpleReplaceFiles);
  }

  public get allFiles(): string[] {
    return [
      ...this.allFlutterStaticFiles,
      ...this.allSimpleReplaceFiles,
    ];
  }

  public getStaticServerpodFiles(): string[] {
    return ServerpodFiles.staticFiles;
  }
}