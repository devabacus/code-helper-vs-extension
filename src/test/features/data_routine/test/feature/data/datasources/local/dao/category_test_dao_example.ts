export const testCategoryDaoExample = `import 'package:a13/core/database/local/database.dart';
import 'package:a13/features/home/data/datasources/local/dao/category/category_dao.dart';
import 'package:drift/drift.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../../../core/database/local/test_database_service.dart';

void main() {
  late TestDatabaseService databaseService;
  late CategoryDao categoryDao;

  setUp(() {
    databaseService = TestDatabaseService();
    categoryDao = CategoryDao(databaseService);
  });

  tearDown(() async {
    await databaseService.close();
  });

  group('CategoryDao', () {
    test('should create a new category', () async {
      final categoryCompanion = CategoryTableCompanion.insert(
        title: 'title 1',
      );

      final categoryId = await categoryDao.createCategory(categoryCompanion);

      expect(categoryId, 1); 
    });

    test('should get all categories', () async {
      await categoryDao.createCategory(
        CategoryTableCompanion.insert(title: 'title 1'),
      );
      await categoryDao.createCategory(
        CategoryTableCompanion.insert(title: 'title 2'),
      );

      final categories = await categoryDao.getCategories();

      expect(categories.length, 2);
      expect(categories[0].title, 'title 1');
      expect(categories[1].title, 'title 2');
    });

    test('should get category by id', () async {
      await categoryDao.createCategory(
        CategoryTableCompanion.insert(title: 'title 1'),
      );

      final category = await categoryDao.getCategoryById(1);

      expect(category.id, 1);
      expect(category.title, 'title 1');
    });

    test('should update category', () async {
      await categoryDao.createCategory(
        CategoryTableCompanion.insert(title: 'title 1'),
      );

      await categoryDao.updateCategory(
        CategoryTableCompanion(
          id: const Value(1),
          title: const Value('Updated Category'),
        ),
      );

      final updatedCategory = await categoryDao.getCategoryById(1);

      expect(updatedCategory.title, 'Updated Category');
    });

    test('should delete category', () async {
      await categoryDao.createCategory(
        CategoryTableCompanion.insert(title: 'title 1'),
      );

      await categoryDao.deleteCategory(1);

      expect(
        () => categoryDao.getCategoryById(1),
        throwsA(
          isA<StateError>(),
        ), 
      );
    });
  });
}



`;