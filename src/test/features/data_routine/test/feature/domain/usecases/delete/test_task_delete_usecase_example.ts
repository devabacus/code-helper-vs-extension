export const TestTaskDeleteUseCaseExample = `import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/delete.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_delete_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late DeleteTaskUseCase deleteTaskUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    deleteTaskUseCase = DeleteTaskUseCase(mockITaskRepository);
  });

  test('should call delete with correct id', () async {
    final testId = uuid.v7();
    
    when(
      mockITaskRepository.deleteTask(testId),
    ).thenAnswer((_) async => {});

    await deleteTaskUseCase(testId);

    verify(mockITaskRepository.deleteTask(testId)).called(1);
  });
}


`

;