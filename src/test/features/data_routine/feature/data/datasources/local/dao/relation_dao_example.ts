// src/test/features/data_routine/feature/data/datasources/local/dao/relation_dao_example.ts

export const taskTagMapDaoExample = `
import 'package:drift/drift.dart';
import '../../../../../../core/database/local/database.dart';
import '../tables/tag_table.dart';
import '../tables/task_table.dart';
import '../tables/task_tag_map_table.dart';

part 'task_tag_map_dao.g.dart';

@DriftAccessor(tables: [TaskTagMapTable, TaskTable, TagTable])
class TaskTagMapDao extends DatabaseAccessor<AppDatabase> with _$TaskTagMapDaoMixin {
  TaskTagMapDao(super.db);

  Future<List<TagTableData>> getTagsForTask(int taskId) {
    return (select(tagTable)
      ..where((t) => t.id.isInQuery(
          selectOnly(taskTagMapTable)
            ..addColumns([taskTagMapTable.tagId])
            ..where(taskTagMapTable.taskId.equals(taskId)))))
        .get();
  }

  Future<List<TaskTableData>> getTasksWithTag(int tagId) {
    return (select(taskTable)
      ..where((t) => t.id.isInQuery(
          selectOnly(taskTagMapTable)
            ..addColumns([taskTagMapTable.taskId])
            ..where(taskTagMapTable.tagId.equals(tagId)))))
        .get();
  }

  Future<void> addTagToTask(int taskId, int tagId) {
    return into(taskTagMapTable).insert(
      TaskTagMapTableCompanion.insert(taskId: taskId, tagId: tagId),
    );
  }

  Future<void> removeTagFromTask(int taskId, int tagId) {
    return (delete(taskTagMapTable)
      ..where((t) => t.taskId.equals(taskId) & t.tagId.equals(tagId)))
        .go();
  }

  Future<void> removeAllTagsFromTask(int taskId) {
    return (delete(taskTagMapTable)..where((t) => t.taskId.equals(taskId))).go();
  }
}`;