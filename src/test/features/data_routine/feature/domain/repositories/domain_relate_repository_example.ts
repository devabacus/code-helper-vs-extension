export const domainRelateRepostitoryExample = `
import '../entities/tag/tag.dart';
import '../entities/task/task.dart';

abstract class ITaskTagMapRepository {
  
  Future<List<TagEntity>> getTagsForTask(String taskId);
  Future<List<TaskEntity>> getTasksWithTag(String tagId);
  Future<void> addTagToTask(String taskId, String tagId);
  Future<void> removeTagFromTask(String taskId, String tagId);
  Future<void> removeAllTagsFromTask(String taskId);    
}
`;