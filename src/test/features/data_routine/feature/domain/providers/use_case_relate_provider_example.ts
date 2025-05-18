export const useCaseRelateProviderExample = `import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/providers/task_tag_map/task_tag_map_data_providers.dart';
import '../../usecases/task_tag/add_tag_to_task.dart';
import '../../usecases/task_tag/get_tags_for_task.dart';
import '../../usecases/task_tag/get_task_with_tag.dart';
import '../../usecases/task_tag/remove_all_tags_from_task.dart';
import '../../usecases/task_tag/remove_tag_from_task.dart';

part 'task_tag_usecase_providers.g.dart';

@riverpod
AddTagToTaskUseCase addTagToTaskUseCase (Ref ref) {
  final repository = ref.read(taskTagMapRepositoryProvider);
  return AddTagToTaskUseCase(repository);
}

@riverpod
GetTagsForTaskUseCase getTagsForTaskUseCase(Ref ref) {
  final repository = ref.read(taskTagMapRepositoryProvider);
  return GetTagsForTaskUseCase(repository);
}

@riverpod
GetTaskWithTagUseCase getTaskWithTagUseCase(Ref ref) {
  final repository = ref.read(taskTagMapRepositoryProvider);
  return GetTaskWithTagUseCase(repository);
}

@riverpod
RemoveTagFromTaskUseCase removeTagFromTaskUseCase(Ref ref) {
  final repository = ref.read(taskTagMapRepositoryProvider);
  return RemoveTagFromTaskUseCase(repository);
}

@riverpod
RemoveAllTagsFromTaskUseCase removeAllTagsFromTaskUseCase(Ref ref) {
  final repository = ref.read(taskTagMapRepositoryProvider);
  return RemoveAllTagsFromTaskUseCase(repository);
}
`;


