export const TestTaskDeleteUseCaseExample = `import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/delete.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'task_delete_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late DeleteTaskUseCase deleteTaskUseCase;
  late MockITaskRepository mockITaskRepository;

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    deleteTaskUseCase = DeleteTaskUseCase(mockITaskRepository);
  });

  test('should call delete with correct id', () async {
    const taskId = 1;
    
    when(
      mockITaskRepository.deleteTask(taskId),
    ).thenAnswer((_) async => {});

    await deleteTaskUseCase(taskId);

    verify(mockITaskRepository.deleteTask(taskId)).called(1);
  });
}
`

;