export const testCategoryRepostitoryImplExample = `import 'package:project_name/features/feature_name/data/datasources/local/interfaces/category_local_datasource_service.dart';
import 'package:project_name/features/feature_name/data/models/category/category_model.dart';
import 'package:project_name/features/feature_name/data/repositories/category_repository_impl.dart';
import 'package:project_name/features/feature_name/domain/entities/category/category.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'category_repository_impl_test.mocks.dart';


@GenerateMocks([ICategoryLocalDataSource])
void main() {

    late MockICategoryLocalDataSource mockCategoryLocalDataSource;
    late CategoryRepositoryImpl categoryRepositoryImpl;


    setUp((){
      mockCategoryLocalDataSource = MockICategoryLocalDataSource();
      categoryRepositoryImpl = CategoryRepositoryImpl(mockCategoryLocalDataSource);
    });

    group('categoryRepositoryImpl',(){

      final testCategoryModel = CategoryModel(id: 1, title: 'Test Category');
      final testCategoryModelList = [CategoryModel(id: 1, title: 'Test Category')];
      final testCategoryEntity = CategoryEntity(id: -1, title: 'Test Category');
      
      test('getCategories', () async{
          when(mockCategoryLocalDataSource.getCategories()).thenAnswer((_)async=>testCategoryModelList);

          final categories = await categoryRepositoryImpl.getCategories();

          verify(mockCategoryLocalDataSource.getCategories()).called(1);
          expect(categories.length, 1);
          expect(categories[0].id, equals(testCategoryModel.id));
          expect(categories[0].title, equals(testCategoryModel.title));
      });


      test('getCategoryById', () async {
        when(mockCategoryLocalDataSource.getCategoryById(1)).thenAnswer((_)async=>testCategoryModel);

        final result = await categoryRepositoryImpl.getCategoryById(1);

        verify(mockCategoryLocalDataSource.getCategoryById(1)).called(1);
        
        expect(result.id, equals(testCategoryModel.id));
        expect(result.title, equals(testCategoryModel.title));
        
      });
            test('createCategory', () async {
        final expectedId = 1;

        when(mockCategoryLocalDataSource.createCategory(any))
            .thenAnswer((_) async => expectedId);

        final result = await categoryRepositoryImpl.createCategory(testCategoryEntity);

        verify(mockCategoryLocalDataSource.createCategory(any)).called(1);
        expect(result, equals(expectedId));
      });

      test('updateCategory', () async {
        when(mockCategoryLocalDataSource.updateCategory(any))
            .thenAnswer((_) async => {});

        await categoryRepositoryImpl.updateCategory(testCategoryEntity);

        verify(mockCategoryLocalDataSource.updateCategory(any)).called(1);
      });

      test('deleteCategory', () async {
        
        final categoryId = 1;

        when(mockCategoryLocalDataSource.deleteCategory(categoryId))
            .thenAnswer((_) async => {});

        await categoryRepositoryImpl.deleteCategory(categoryId);

        verify(mockCategoryLocalDataSource.deleteCategory(categoryId)).called(1);
      });

    });

}


`;