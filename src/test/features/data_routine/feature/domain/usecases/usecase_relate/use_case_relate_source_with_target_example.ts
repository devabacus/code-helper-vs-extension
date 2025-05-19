
export const useCaseRelateGetSourcesWithTargetFileExample = `
import '../../entities/task/task.dart';
import '../../repositories/task_tag_map_repository.dart';

class GetTasksWithTagUseCase {
  final ITaskTagMapRepository repository;

  const GetTasksWithTagUseCase(this.repository);

  Future<List<TaskEntity>> call(String tagId) {
    return repository.getTasksWithTag(tagId);
  }
}
`;
