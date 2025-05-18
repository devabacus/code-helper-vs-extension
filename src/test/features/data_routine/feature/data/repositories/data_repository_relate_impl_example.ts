export const dataRepositoryRelateImplCategoryExample = `import '../models/extensions/tag_model_extension.dart';
import '../../domain/entities/tag/tag.dart';
import '../../domain/entities/task/task.dart';
import '../../domain/repositories/task_tag_map_repository.dart';
import '../datasources/local/interfaces/task_tag_map_local_datasource_service.dart';
import '../models/extensions/task_model_extension.dart';

class TaskTagMapRepositoryImpl implements ITaskTagMapRepository {
  final ITaskTagMapLocalDataSource _dataSource;

  TaskTagMapRepositoryImpl(this._dataSource);

  @override
  Future<List<TagEntity>> getTagsForTask(String taskId) async {
    final tagModels = await _dataSource.getTagsForTask(taskId);
    return tagModels.toEntities();
  }

  @override
  Future<List<TaskEntity>> getTasksWithTag(String tagId) async {
    final taskModels = await _dataSource.getTasksWithTag(tagId);
    return taskModels.toEntities();
  }

  @override
  Future<void> addTagToTask(String taskId, String tagId) async {
    await _dataSource.addTagToTask(taskId, tagId);
  }

  @override
  Future<void> removeTagFromTask(String taskId, String tagId) async {
    await _dataSource.removeTagFromTask(taskId, tagId);
  }

  @override
  Future<void> removeAllTagsFromTask(String taskId) async {
    await _dataSource.removeAllTagsFromTask(taskId);
  }
}

`;