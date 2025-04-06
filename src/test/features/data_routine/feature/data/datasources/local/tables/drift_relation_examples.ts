export const tableTaskTagMapExample = `
import 'package:dataroutine6/features/tasks/data/datasources/local/tables/tag_table.dart';
import 'package:dataroutine6/features/tasks/data/datasources/local/tables/task_table.dart';
import 'package:drift/drift.dart';

class TaskTagMapTable extends Table {
  IntColumn get taskId => integer().references(TaskTable, #id)();
  IntColumn get tagId => integer().references(TagTable, #id)();
  
  @override
  Set<Column> get primaryKey => {taskId, tagId};
}
`;