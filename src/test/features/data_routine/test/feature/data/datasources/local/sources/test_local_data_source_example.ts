export const testCategorLocalSourceExample = `import 'package:project_name/core/database/local/database.dart';
import 'package:project_name/features/feature_name/data/datasources/local/dao/category/category_dao.dart';
import 'package:project_name/features/feature_name/data/datasources/local/sources/category_local_data_source.dart';
import 'package:project_name/features/feature_name/data/models/category/category_model.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'category_local_data_source_test.mocks.dart';

@GenerateMocks([CategoryDao])
void main() {
  late MockCategoryDao mockCategoryDao;
  late CategoryLocalDataSource dataSource;

  setUp(() {
    mockCategoryDao = MockCategoryDao();
    dataSource = CategoryLocalDataSource(mockCategoryDao);
  });

  group('CategoryLocalDataSource', () {
    final testCategoryTableData = CategoryTableData(
      id: 1,
      title: 'Test Category',
    );

    final testCategoryModel = CategoryModel(id: 1, title: 'Test Category');

    final testCategoryModelCompanion = CategoryTableCompanion.insert(
      title: 'Test Category',
    );

    final testCategoryModelWithId = CategoryModel(
      id: 1,
      title: 'Test Category',
    );

    final testCategoryTableDataList = [testCategoryTableData];

    test('getCategories должен вернуть list of CategoryModel', () async {
      when(
        mockCategoryDao.getCategories(),
      ).thenAnswer((_) async => testCategoryTableDataList);

      final result = await dataSource.getCategories();

      verify(mockCategoryDao.getCategories()).called(1);
      expect(result.length, equals(1));
      expect(result[0].id, equals(testCategoryModel.id));
      expect(result[0].title, equals(testCategoryModel.title));
    });

    test('getCategoryById должен вернуть CategoryModel', () async {
      when(
        mockCategoryDao.getCategoryById(1),
      ).thenAnswer((_) async => testCategoryTableData);

      final result = await dataSource.getCategoryById(1);

      verify(mockCategoryDao.getCategoryById(1)).called(1);
      expect(result.id, equals(testCategoryModel.id));
      expect(result.title, equals(testCategoryModel.title));
    });

    test(
      'createCategory should call categoryDao.createCategory and return id',
      () async {
        when(
          mockCategoryDao.createCategory(testCategoryModelCompanion),
        ).thenAnswer((_) async => 1);

        final result = await dataSource.createCategory(testCategoryModel);

        verify(mockCategoryDao.createCategory(any)).called(1);
        expect(result, equals(1));
      },
    );

    test('updateCategory should call categoryDao.updateCategory', () async {
      when(mockCategoryDao.updateCategory(any)).thenAnswer((_) async => {});

      await dataSource.updateCategory(testCategoryModelWithId);

      verify(mockCategoryDao.updateCategory(any)).called(1);
    });

    test('deleteCategory should call categoryDao.deleteCategory', () async {
      when(mockCategoryDao.deleteCategory(1)).thenAnswer((_) async => {});

      await dataSource.deleteCategory(1);

      verify(mockCategoryDao.deleteCategory(1)).called(1);
    });
  });
}


`;