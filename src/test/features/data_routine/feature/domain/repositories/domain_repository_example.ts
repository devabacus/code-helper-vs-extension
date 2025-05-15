export const domainRepostitoryExample = `
import '../entities/category/category.dart';

abstract class ICategoryRepository {
  Future<List<CategoryEntity>> getCategories();
  Stream<List<CategoryEntity>> watchCategories();
  Future<CategoryEntity> getCategoryById(String id);
  Future<String> createCategory(CategoryEntity category);
  Future<void> updateCategory(CategoryEntity category);
  Future<void> deleteCategory(String id);
}

`;