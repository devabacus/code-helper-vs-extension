export const dataDaoRelateExample =
    `import 'package:dataroutine6/core/database/local/interface/database_service.dart';
import 'package:drift/drift.dart';
import '../../../../../../core/database/local/database.dart';
import '../tables/tag_table.dart';
import '../tables/task_table.dart';
import '../tables/task_tag_map_table.dart';

part 'task_tag_map_dao.g.dart';

@DriftAccessor(tables: [TaskTagMapTable, TaskTable, TagTable])
class TaskTagMapDao extends DatabaseAccessor<AppDatabase>
    with _$TaskTagMapDaoMixin {
  TaskTagMapDao(IDatabaseService databaseService)
    : super(databaseService.database);

  Future<List<TagTableData>> getTagsForTask(String taskId) {
    return (select(tagTable)..where(
      (t) => t.id.isInQuery(
        selectOnly(taskTagMapTable)
          ..addColumns([taskTagMapTable.tagId])
          ..where(taskTagMapTable.taskId.equals(taskId)),
      ),
    )).get();
  }

  Future<List<TaskTableData>> getTasksWithTag(String tagId) {
    return (select(taskTable)..where(
      (t) => t.id.isInQuery(
        selectOnly(taskTagMapTable)
          ..addColumns([taskTagMapTable.taskId])
          ..where(taskTagMapTable.tagId.equals(tagId)),
      ),
    )).get();
  }

  Future<void> addTagToTask(String taskId, String tagId) {
    return into(
      taskTagMapTable,
    ).insert(TaskTagMapTableCompanion.insert(taskId: taskId, tagId: tagId));
  }

  Future<void> removeTagFromTask(String taskId, String tagId) {
    return (delete(taskTagMapTable)
      ..where((t) => t.taskId.equals(taskId) & t.tagId.equals(tagId))).go();
  }

  Future<void> removeAllTagsFromTask(String taskId) {
    return (delete(taskTagMapTable)
      ..where((t) => t.taskId.equals(taskId))).go();
  }
}

`;