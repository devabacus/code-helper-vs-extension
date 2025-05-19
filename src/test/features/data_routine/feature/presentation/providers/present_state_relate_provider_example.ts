export const presentStateRelateProviderExample = `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/tag/tag.dart';
import '../../../domain/entities/task/task.dart';
import '../../../domain/providers/task_tag_map/task_tag_map_usecase_providers.dart';

part 'task_tag_state_providers.g.dart';

@riverpod
class TaskTags extends _$TaskTags {
  @override
  Future<List<TagEntity>> build({required String taskId}) {
    ref.keepAlive();
    return ref.read(getTagsForTaskUseCaseProvider)(taskId);
  }

  Future<void> addTagToTask(String taskId, String tagId) async {
    state = await AsyncValue.guard(() async {
      await ref.read(addTagToTaskUseCaseProvider)(taskId, tagId);
      return ref.read(getTagsForTaskUseCaseProvider)(taskId);
    });
  }

  Future<void> removeTagFromTask(String taskId, String tagId) async {
    state = await AsyncValue.guard(() async {
      await ref.read(removeTagFromTaskUseCaseProvider)(taskId, tagId);
      return ref.read(getTagsForTaskUseCaseProvider)(taskId);
    });
  }

  Future<void> removeAllTagsFromTask(String taskId) async {
    state = await AsyncValue.guard(() async {
      await ref.read(removeAllTagsFromTaskUseCaseProvider)(taskId);
      return ref.read(getTagsForTaskUseCaseProvider)(taskId);
    });
  }
}

@riverpod
class TasksWithTag extends _$TasksWithTag {
  @override
  Future<List<TaskEntity>> build({required String tagId}) {
    return ref.read(getTasksWithTagUseCaseProvider)(tagId);
  }
}

`;