

export const appDatabaseExampleFileEmpty = `
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

@DriftDatabase(tables: [])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? excutor]) : super(excutor ?? _openConnection());

  @override
  int get schemaVersion => 1;

@override
MigrationStrategy get migration => MigrationStrategy(
      onCreate: (Migrator m) {
        return m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
            
        if (from < 2) {
          //await m.addColumn(taskItems, taskItems.createAt);
          //TODO
        }        
        
      },
    );


  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'data_routing3',
    );
  }
}
`;



export const appDatabaseExampleFileOneTable = `
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

@DriftDatabase(tables: [CategoryTable])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? excutor]) : super(excutor ?? _openConnection());

  @override
  int get schemaVersion => 1;

@override
MigrationStrategy get migration => MigrationStrategy(
      onCreate: (Migrator m) {
        return m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
            
        if (from < 2) {
          //await m.addColumn(taskItems, taskItems.createAt);
          //TODO
        }        
        
      },
    );


  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'data_routing3',
    );
  }
}
`;

export const appDatabaseExampleFileTwoTable = `
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'database.g.dart';

@DriftDatabase(tables: [CategoryTable, TagTable])
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? excutor]) : super(excutor ?? _openConnection());

  @override
  int get schemaVersion => 1;

@override
MigrationStrategy get migration => MigrationStrategy(
      onCreate: (Migrator m) {
        return m.createAll();
      },
      onUpgrade: (Migrator m, int from, int to) async {
            
        if (from < 2) {
          //await m.addColumn(taskItems, taskItems.createAt);
          //TODO
        }        
        
      },
    );


  static QueryExecutor _openConnection() {
    return driftDatabase(
      name: 'data_routing3',
    );
  }
}
`;