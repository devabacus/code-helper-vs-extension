export const TestCategoryUpdateUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/category/category.dart';
import 'package:project_name/features/feature_name/domain/repositories/category_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/category/update.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'category_update_usecase_test.mocks.dart';

@GenerateMocks([ICategoryRepository])
void main() {
  late UpdateCategoryUseCase updateCategoryUseCase;
  late MockICategoryRepository mockICategoryRepository;

  setUp(() {
    mockICategoryRepository = MockICategoryRepository();
    updateCategoryUseCase = UpdateCategoryUseCase(mockICategoryRepository);
  });

  test('should call correct update method', () async {
    final category = CategoryEntity(id: 1, title: 'title 1');
    
    when(
      mockICategoryRepository.updateCategory(category),
    ).thenAnswer((_) async => {});

    await updateCategoryUseCase(category);

    verify(mockICategoryRepository.updateCategory(category)).called(1);
  });
}
`

;