export const localDataSourceRelateFileExample = `import '../../../../../../core/database/local/interface/i_database_service.dart';
import '../dao/task_tag_map/task_tag_map_dao.dart';
import '../interfaces/task_tag_map_local_datasource_service.dart';
import '../tables/extensions/tag_table_extension.dart';
import '../tables/extensions/task_table_extension.dart';
import '../../../models/tag/tag_model.dart';
import '../../../models/task/task_model.dart';

class TaskTagMapLocalDataSource implements ITaskTagMapLocalDataSource {
  final TaskTagMapDao _dao;

  TaskTagMapLocalDataSource(IDatabaseService databaseService)
    : _dao = TaskTagMapDao(databaseService);

  @override
  Future<List<TagModel>> getTagsForTask(String taskId) async {
    final tags = await _dao.getTagsForTask(taskId);
    return tags.toModels();
  }

  @override
  Future<List<TaskModel>> getTasksWithTag(String tagId) async {
    final tasks = await _dao.getTasksWithTag(tagId);
    return tasks.toModels();
  }

  @override
  Future<void> addTagToTask(String taskId, String tagId) async {
    await _dao.addTagToTask(taskId, tagId);
  }

  @override
  Future<void> removeTagFromTask(String taskId, String tagId) async {
    await _dao.removeTagFromTask(taskId, tagId);
  }

  @override
  Future<void> removeAllTagsFromTask(String taskId) async {
    await _dao.removeAllTagsFromTask(taskId);
  }
}

`;