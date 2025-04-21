export const TestCategoryCreateUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/category/category.dart';
import 'package:project_name/features/feature_name/domain/repositories/category_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/category/create.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'category_create_usecase_test.mocks.dart';

@GenerateMocks([ICategoryRepository])
void main() {
  late CreateCategoryUseCase createCategoryUseCase;
  late MockICategoryRepository mockICategoryRepository;

  setUp(() {
    mockICategoryRepository = MockICategoryRepository();
    createCategoryUseCase = CreateCategoryUseCase(mockICategoryRepository);
  });

  test('should create new with id 1', () async {
    final expectedId = 1;
    final categoryEntity = CategoryEntity(id: -1, title: 'title 1');

    when(
      mockICategoryRepository.createCategory(categoryEntity),
    ).thenAnswer((_) async => 1);

    final result = await createCategoryUseCase(categoryEntity);

    verify(mockICategoryRepository.createCategory(categoryEntity)).called(1);
    expect(result, expectedId);
  });
}
`

;