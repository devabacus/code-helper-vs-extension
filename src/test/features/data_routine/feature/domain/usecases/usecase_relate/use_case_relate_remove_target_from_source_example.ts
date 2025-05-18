
export const useCaseRelateRemoveTargetFromSourceFileExample = `
import '../../repositories/task_tag_map_repository.dart';

class RemoveTagFromTaskUseCase {
  final ITaskTagMapRepository repository;

  RemoveTagFromTaskUseCase(this.repository);

  Future<void> call(String taskId, String tagId) {
    return repository.removeTagFromTask(taskId, tagId);
  }
}
`;
