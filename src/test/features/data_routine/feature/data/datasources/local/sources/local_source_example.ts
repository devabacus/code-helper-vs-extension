export const localDataSourceFileExample = `
import '../../../models/extensions/category/category_model_extension.dart';
import '../../../models/extensions/category/category_table_extension.dart';
import '../../../../../../core/database/local/database.dart';
import '../../../../data/models/category/category_model.dart';
import '../../local/dao/category/category_dao.dart';

class CategoryLocalDataSource {
  final CategoryDao _categoryDao;

  CategoryLocalDataSource(AppDatabase db) : _categoryDao = CategoryDao(db);

    Future<List<CategoryModel>> getCategories() async {
    final categories = await _categoryDao.getCategories();
    return categories.toModels();
  }

  Future<CategoryModel> getCategoryById(int id) async {
    final category = await _categoryDao.getCategoryById(id);
    return category.toModel();
  }

  Future<int> createCategory(CategoryModel category) {
    return _categoryDao.createCategory(category.toCompanion());
  }

  Future<void> updateCategory(CategoryModel category) {
    return _categoryDao.updateCategory(category.toCompanionWithId());
  }

  Future<void> deleteCategory(int id) async {
      await _categoryDao.deleteCategory(id);
    }
}

`;