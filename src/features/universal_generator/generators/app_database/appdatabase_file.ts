export const appDatabaseCont = `
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';
import 'package:uuid/uuid.dart';

import 'database_types.dart';
// === GENERATED_IMPORTS_START ===
// === GENERATED_IMPORTS_END ===

part 'database.g.dart';

@DriftDatabase(tables: [
// === GENERATED_TABLES_START ===
// === GENERATED_TABLES_END ===
])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 1;

@override
MigrationStrategy get migration => MigrationStrategy(
      onCreate: (Migrator m) {
        return m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
            
        if (from < 2) {

        }        
        // === GENERATED_MIGRATION_START ===
        // === GENERATED_MIGRATION_END ===
        
      },
    );


  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: '{{targetProject}}_flutter',
    );
  }
}

`;
