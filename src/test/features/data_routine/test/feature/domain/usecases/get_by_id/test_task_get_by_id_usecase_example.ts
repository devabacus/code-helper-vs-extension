export const TestTaskGetByIdUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/get_by_id.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_get_by_id_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late GetTaskByIdUseCase getTaskByIdUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    getTaskByIdUseCase = GetTaskByIdUseCase(mockITaskRepository);
  });

  test('should return correct item by id', () async {
    final testId = uuid.v7();
    final task = TaskEntity(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1');
    
    when(
      mockITaskRepository.getTaskById(testId),
    ).thenAnswer((_) async => task);

    final result = await getTaskByIdUseCase(testId);

    verify(mockITaskRepository.getTaskById(testId)).called(1);
    expect(result, task);
    expect(result?.id, testId);
    expect(result?.title, 'title 1');
  });

  test('shoul throw exception', () async {
    const wrongId = '999';
    
    when(
      mockITaskRepository.getTaskById(wrongId),
    ).thenThrow(StateError('Task not found'));

    expect(
      () => getTaskByIdUseCase(wrongId),
      throwsA(isA<StateError>()),
    );
    verify(mockITaskRepository.getTaskById(wrongId)).called(1);
  });
}

`

;