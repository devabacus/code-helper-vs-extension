
export const useCaseRelateGetFileExample = `
import '../../entities/tag/tag.dart';
import '../../repositories/task_tag_map_repository.dart';

class GetTagsForTaskUseCase {
  final ITaskTagMapRepository repository;

  GetTagsForTaskUseCase(this.repository);

  Future<List<TagEntity>> call(String taskId) {
    return repository.getTagsForTask(taskId);
  }
}

`;


