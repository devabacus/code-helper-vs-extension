export const presentFilterRelateProviderExampleContent = `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../domain/entities/tag/tag.dart';
import '../tag/tag_state_providers.dart';
import './task_tag_state_providers.dart';

part 'filter_tag_for_task_provider.g.dart';


@riverpod
Future<List<TagEntity>> filteredTagsForTask(
  FilteredTagsForTaskRef ref,
  String? taskId,
) async {
  final allTags = await ref.watch(tagsProvider.future);
  
  if (taskId == null) {
    return allTags;
  }
  
  final assignedTags = await ref.watch(taskTagsProvider(taskId: taskId).future);
  
  return allTags.where((tag) {
    return !assignedTags.any((assignedTag) => assignedTag.id == tag.id);
  }).toList();
}

`;