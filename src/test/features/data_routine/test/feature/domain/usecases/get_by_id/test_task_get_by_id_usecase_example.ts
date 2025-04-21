export const TestTaskGetByIdUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/get_by_id.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'task_get_by_id_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late GetTaskByIdUseCase getTaskByIdUseCase;
  late MockITaskRepository mockITaskRepository;

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    getTaskByIdUseCase = GetTaskByIdUseCase(mockITaskRepository);
  });

  test('should return correct item by id', () async {
    const taskId = 1;
    final task = TaskEntity(id: taskId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
    
    when(
      mockITaskRepository.getTaskById(taskId),
    ).thenAnswer((_) async => task);

    final result = await getTaskByIdUseCase(taskId);

    verify(mockITaskRepository.getTaskById(taskId)).called(1);
    expect(result, task);
    expect(result?.id, taskId);
    expect(result?.title, 'title 1');
  });

  test('shoul throw exception', () async {
    const taskId = 999;
    
    when(
      mockITaskRepository.getTaskById(taskId),
    ).thenThrow(StateError('Task not found'));

    expect(
      () => getTaskByIdUseCase(taskId),
      throwsA(isA<StateError>()),
    );
    verify(mockITaskRepository.getTaskById(taskId)).called(1);
  });
}

`

;