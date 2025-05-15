export const iLocalDatasourceServiceExample = `
import '../../../models/category/category_model.dart';

abstract class ICategoryLocalDataSource {
  Future<List<CategoryModel>> getCategories();
  Stream<List<CategoryModel>> watchCategories();
  Future<CategoryModel> getCategoryById(String id);
  Future<String> createCategory(CategoryModel category);
  Future<void> updateCategory(CategoryModel category);
  Future<void> deleteCategory(String id);
}

`;