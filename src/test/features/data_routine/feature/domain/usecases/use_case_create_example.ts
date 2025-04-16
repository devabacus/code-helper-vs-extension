
export const useCaseCreateFileExample = `
import '../../repositories/category_repository.dart';
import '../../entities/category/category.dart';

class CreateCategoryUseCase {
  final ICategoryRepository _repository;
  
  CreateCategoryUseCase(this._repository);
  
  Future<int> call(CategoryEntity category) {
    return _repository.createCategory(category);
  }
}
`;


