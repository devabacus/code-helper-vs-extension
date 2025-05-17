export const TestTaskCreateUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/create.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_create_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late CreateTaskUseCase createTaskUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    createTaskUseCase = CreateTaskUseCase(mockITaskRepository);
  });

  test('should create new category', () async {
    final testId = uuid.v7();
    final taskEntity = TaskEntity(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1');

    when(
      mockITaskRepository.createTask(taskEntity),
    ).thenAnswer((_) async => testId);

    final result = await createTaskUseCase(taskEntity);

    verify(mockITaskRepository.createTask(taskEntity)).called(1);
    expect(result, testId);
  });
}


`

;