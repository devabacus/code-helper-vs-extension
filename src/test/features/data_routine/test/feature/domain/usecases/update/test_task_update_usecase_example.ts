export const TestTaskUpdateUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/update.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_update_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late UpdateTaskUseCase updateTaskUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    updateTaskUseCase = UpdateTaskUseCase(mockITaskRepository);
  });

  test('should call correct update method', () async {
    final testId = uuid.v7();
    final task = TaskEntity(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1');
    
    when(
      mockITaskRepository.updateTask(task),
    ).thenAnswer((_) async => {});

    await updateTaskUseCase(task);

    verify(mockITaskRepository.updateTask(task)).called(1);
  });
}


`

;