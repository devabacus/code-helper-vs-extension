
export const database_cont = (db_name: string) => {
    
return `
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import 'package:path_provider/path_provider.dart';


part 'database.g.dart';

@DriftDatabase(tables: [])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? excutor]) : super(excutor ?? _openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: '${db_name}',
      native: const DriftNativeOptions(databaseDirectory: getApplicationSupportDirectory),
    );
  }
}

`;};
