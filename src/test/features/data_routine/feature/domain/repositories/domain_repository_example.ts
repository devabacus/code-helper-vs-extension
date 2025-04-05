export const domainRepostitoryExample = `
import '../entities/category/category.dart';

abstract class CategoryRepository {
  Future<List<CategoryEntity>> getCategories();
  Future<CategoryEntity> getCategoryById(int id);
  Future<int> createCategory(CategoryEntity category);
  Future<void> updateCategory(CategoryEntity category);
  Future<void> deleteCategory(int id);
}

`;