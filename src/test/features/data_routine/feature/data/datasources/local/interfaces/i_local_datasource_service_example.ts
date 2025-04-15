export const iLocalDatasourceServiceExample = `
import '../../../models/category/category_model.dart';

abstract class ICategoryLocalDataSource {
  Future<List<CategoryModel>> getCategories();
  Future<CategoryModel> getCategoryById(int id);
  Future<int> createCategory(CategoryModel category);
  Future<void> updateCategory(CategoryModel category);
  Future<void> deleteCategory(int id);
}

`;