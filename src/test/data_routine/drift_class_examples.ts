export const tableCategory = `
import 'package:drift/drift.dart';

class CategoryTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  
}

`;

export const tableTask = `
import 'package:drift/drift.dart';

class TaskTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  TextColumn get description => text()();
  IntColumn get age => integer()();
  
  
}

`;

export const tableAuth = `
import 'package:drift/drift.dart';

class AuthTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  
}

`;