export const DatabaseServiceExample = `import '../database.dart';
import '../interface/database_service.dart';

class DriftDatabaseService implements IDatabaseService {
  final AppDatabase _database;

  DriftDatabaseService(this._database);

  @override
  AppDatabase get database => _database;

  @override
  Future<void> close() => _database.close();
  
}

`;