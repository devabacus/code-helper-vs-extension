export const tableCategory = `
import 'package:drift/drift.dart';

class CategoryTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  
}

`;

export const tableTask = `
import '../../../datasources/local/tables/category_table.dart';
import 'package:drift/drift.dart';

class TaskTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  TextColumn get description => text()();
  IntColumn get duration => integer()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get dueDateTime => dateTime()();
  IntColumn get categoryId => integer().references(CategoryTable, #id)();
}


`;

export const tableAuth = `
import 'package:drift/drift.dart';

class AuthTable extends Table {

  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  
}

`;
