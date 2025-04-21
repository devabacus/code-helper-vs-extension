export const TestTaskCreateUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/create.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'task_create_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late CreateTaskUseCase createTaskUseCase;
  late MockITaskRepository mockITaskRepository;

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    createTaskUseCase = CreateTaskUseCase(mockITaskRepository);
  });

  test('should create new with id 1', () async {
    final expectedId = 1;
    final taskEntity = TaskEntity(id: -1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);

    when(
      mockITaskRepository.createTask(taskEntity),
    ).thenAnswer((_) async => 1);

    final result = await createTaskUseCase(taskEntity);

    verify(mockITaskRepository.createTask(taskEntity)).called(1);
    expect(result, expectedId);
  });
}

`

;