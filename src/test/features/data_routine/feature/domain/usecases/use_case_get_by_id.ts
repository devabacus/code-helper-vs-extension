

export const useCaseGetByIdExample = `
import '../../repositories/category_repository.dart';
import '../../entities/category/category.dart';

class GetCategoryByIdUseCase {
  final CategoryRepository _repository;

  GetCategoryByIdUseCase(this._repository);

  Future<CategoryEntity?> call(int id) {
    return _repository.getCategoryById(id);
  }
}
`;