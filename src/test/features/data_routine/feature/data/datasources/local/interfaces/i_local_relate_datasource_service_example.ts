export const iLocalDatasourceRelateServiceExample = `
import '../../../models/tag/tag_model.dart';
import '../../../models/task/task_model.dart';

abstract class ITaskTagMapLocalDataSource {
  Future<List<TagModel>> getTagsForTask(String taskId);
  Future<List<TaskModel>> getTasksWithTag(String tagId);
  Future<void> addTagToTask(String taskId, String tagId);
  Future<void> removeTagFromTask(String taskId, String tagId);
  Future<void> removeAllTagsFromTask(String taskId);
}
`;