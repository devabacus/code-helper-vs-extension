export const TestTaskWatchUseCaseExample = `import 'dart:async';
import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:project_name/features/feature_name/domain/repositories/task_repository.dart';
import 'package:project_name/features/feature_name/domain/usecases/task/watch_all.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_watch_usecase_test.mocks.dart';

@GenerateMocks([ITaskRepository])
void main() {
  late WatchTasksUseCase watchTasksUseCase;
  late MockITaskRepository mockITaskRepository;
  const uuid = Uuid();

  setUp(() {
    mockITaskRepository = MockITaskRepository();
    watchTasksUseCase = WatchTasksUseCase(mockITaskRepository);
  });

  group('watch categories test', () {
    test('should return stream of task list from repository', () {
      final testId1 = uuid.v7();
      final testId2 = uuid.v7();

      final categoriesList = [
        TaskEntity(id: testId1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'),
        TaskEntity(id: testId2, title: 'title 2', description: 'description 2', duration: 2, createdAt: DateTime(2), dueDateTime: DateTime(2), categoryId: 'categoryId 2'),
      ];

      final controller = StreamController<List<TaskEntity>>();

      when(
        mockITaskRepository.watchTasks(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watchTasksUseCase();
      verify(mockITaskRepository.watchTasks()).called(1);
      expectLater(resultStream, emits(categoriesList));
      controller.add(categoriesList);
      addTearDown(() {
        controller.close();
      });
    });

    test('should handle an empty stream from repository', () {
      final controller = StreamController<List<TaskEntity>>();
      when(
        mockITaskRepository.watchTasks(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watchTasksUseCase();
      verify(mockITaskRepository.watchTasks()).called(1);
      expectLater(resultStream, emitsDone);
      controller.close();
    });

    test('should handle stream errors from repository', () {
      final controller = StreamController<List<TaskEntity>>();
      final exception = Exception('Database error');
      when(
        mockITaskRepository.watchTasks(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watchTasksUseCase();
      verify(mockITaskRepository.watchTasks()).called(1);
      expectLater(resultStream, emitsError(isA<Exception>()));
      controller.addError(exception);
      addTearDown(() {
        controller.close();
      });
    });
  });
}

`

;