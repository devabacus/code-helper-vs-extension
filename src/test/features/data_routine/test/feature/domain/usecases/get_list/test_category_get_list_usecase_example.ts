export const TestCategoryGetListUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/category/category.dart';
import 'package:project_name/features/feature_name/domain/repositories/category_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/category/get_all.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'category_get_list_usecase_test.mocks.dart';

@GenerateMocks([ICategoryRepository])
void main() {
  late GetCategoriesUseCase getCategoriesUseCase;
  late MockICategoryRepository mockICategoryRepository;

  setUp(() {
    mockICategoryRepository = MockICategoryRepository();
    getCategoriesUseCase = GetCategoriesUseCase(mockICategoryRepository);
  });

  test('should return list of items from repository', () async {
    final categories = [
      CategoryEntity(id: 1, title: 'title 1'),
      CategoryEntity(id: 2, title: 'title 2'),
    ];
    
    when(
      mockICategoryRepository.getCategories(),
    ).thenAnswer((_) async => categories);

    final result = await getCategoriesUseCase();

    verify(mockICategoryRepository.getCategories()).called(1);
    expect(result, categories);
    expect(result.length, 2);
  });
}
`

;