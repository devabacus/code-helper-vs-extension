export const localDataSourceFileExample = `
import '../tables/extensions/category_table_extension.dart';
import '../../../models/extensions/category_model_extension.dart';
import '../../../models/category/category_model.dart';
import '../dao/category/category_dao.dart';
import '../interfaces/category_local_datasource_service.dart';

class CategoryLocalDataSource implements ICategoryLocalDataSource {
  final CategoryDao categoryDao;

  CategoryLocalDataSource(this.categoryDao);

  @override
  Future<List<CategoryModel>> getCategories() async {
    final categories = await categoryDao.getCategories();
    return categories.toModels();
  }

  @override
  Future<CategoryModel> getCategoryById(int id) async {
    final category = await categoryDao.getCategoryById(id);
    return category.toModel();
  }

  @override
  Future<int> createCategory(CategoryModel category) {
    return categoryDao.createCategory(category.toCompanion());
  }

  @override
  Future<void> updateCategory(CategoryModel category) {
    return categoryDao.updateCategory(category.toCompanionWithId());
  }

  @override
  Future<void> deleteCategory(int id) async {
    await categoryDao.deleteCategory(id);
  }
}

`;