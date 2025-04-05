export const dataDaoExample =
    `
import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../tables/category_table.dart';

part 'category_dao.g.dart';

@DriftAccessor(tables: [CategoryTable])
class CategoryDao extends DatabaseAccessor<AppDatabase> with _$CategoryDaoMixin {
  CategoryDao(super.db);

  Future<List<CategoryTableData>> getCategories() => select(categoryTable).get();
  
  Future<CategoryTableData> getCategoryById(int id) => 
      (select(categoryTable)..where((t) => t.id.equals(id)))
      .getSingle();
  
  Future<int> createCategory(CategoryTableCompanion category) =>
      into(categoryTable).insert(category);
  
  Future<void> updateCategory(CategoryTableCompanion category) =>
      update(categoryTable).replace(category);
  
  Future<void> deleteCategory(int id) =>
      (delete(categoryTable)..where((t) => t.id.equals(id))).go();
}

`;