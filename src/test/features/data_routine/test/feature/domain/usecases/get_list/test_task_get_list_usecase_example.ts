export const TestTaskGetListUseCaseExample = `import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/get_all.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_get_list_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late GetTasksUseCase getTasksUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    getTasksUseCase = GetTasksUseCase(mockITaskRepository);
  });

  test('should return list of items from repository', () async {
    final testId1 = uuid.v7();
    final testId2 = uuid.v7();

    final tasks = [
      TaskEntity(id: testId1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'),
      TaskEntity(id: testId2, title: 'title 2', description: 'description 2', duration: 2, createdAt: DateTime(2), dueDateTime: DateTime(2), categoryId: 'categoryId 2'),
    ];
    
    when(
      mockITaskRepository.getTasks(),
    ).thenAnswer((_) async => tasks);

    final result = await getTasksUseCase();

    verify(mockITaskRepository.getTasks()).called(1);
    expect(result, tasks);
    expect(result.length, 2);
  });
}

`

;