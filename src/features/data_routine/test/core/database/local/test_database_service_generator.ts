import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";

export class TestDatabaseService extends BaseGenerator {
    
    protected getPath(basePath: string): string {
        return path.join(basePath, "test", "core", "database", "local", "test_database_service.dart");
    }
    protected getContent(data: undefined, projectName: string): string {
        return `import 'package:${projectName}/core/database/local/database.dart';
import 'package:${projectName}/core/database/local/interface/i_database_service.dart';
import 'package:drift/native.dart';

class TestDatabaseService implements IDatabaseService {
  final AppDatabase _database;

  TestDatabaseService() : _database = AppDatabase(NativeDatabase.memory());

  @override
  AppDatabase get database => _database;

  @override
  Future<void> close() => database.close();
}`;    
    }
}
