import path from "path";
import { BaseGenerator } from "../../../core/generators/base_generator";

export class DatabaseService extends BaseGenerator {

    protected getPath(basePath: string): string {
        return path.join(basePath, "lib", "core", "database", "local", "services", "database_service.dart");
    }
    protected getContent(): string {
        return `import '../database.dart';
import '../interface/i_database_service.dart';

class DriftDatabaseService implements IDatabaseService {
  final AppDatabase _database;

  DriftDatabaseService(this._database);

  @override
  AppDatabase get database => _database;

  @override
  Future<void> close() => _database.close();
  
}
`;
    }
}




