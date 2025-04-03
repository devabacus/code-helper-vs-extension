
export const useCaseDeleteExample = `
import '../../repositories/category_repository.dart';

class DeleteCategoryUseCase {
  final CategoryRepository _repository;

  DeleteCategoryUseCase(this._repository);

  Future<void> call(int id) async {
    return _repository.deleteCategory(id);
  }
}
`;
