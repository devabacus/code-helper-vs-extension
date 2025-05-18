
export const useCaseRelateGetSourcesWithTargetFileExample = `
import '../../entities/task/task.dart';
import '../../repositories/task_tag_map_repository.dart';

class GetTaskWithTagUseCase {
  final ITaskTagMapRepository repository;

  const GetTaskWithTagUseCase(this.repository);

  Future<List<TaskEntity>> call(String tagId) {
    return repository.getTasksWithTag(tagId);
  }
}
`;
