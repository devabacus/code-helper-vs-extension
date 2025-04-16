import path from "path";
import { BaseGenerator } from "../../../core/generators/base_generator";

export class DatabaseInterface extends BaseGenerator {

    protected getPath(basePath: string): string {
        return path.join(basePath, "lib", "core", "database", "local", "interface", "i_database_service.dart");;
    }
    protected getContent(): string {
        return `import '../database.dart';

abstract class IDatabaseService{
  Future<void> close();
  AppDatabase get database;
} 

`;
    }
}




