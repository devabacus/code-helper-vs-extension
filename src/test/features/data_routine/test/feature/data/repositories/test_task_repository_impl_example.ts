export const testTaskRepostitoryImplExample = `import 'package:project_name/features/feature_name/data/datasources/local/interfaces/task_local_datasource_service.dart';
import 'package:project_name/features/feature_name/data/models/task/task_model.dart';
import 'package:project_name/features/feature_name/data/repositories/task_repository_impl.dart';
import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import 'task_repository_impl_test.mocks.dart';

@GenerateMocks([ITaskLocalDataSource])
void main() {
  late MockITaskLocalDataSource mockTaskLocalDataSource;
  late TaskRepositoryImpl taskRepositoryImpl;
  const uuid = Uuid();

  setUp(() {
    mockTaskLocalDataSource = MockITaskLocalDataSource();
    taskRepositoryImpl = TaskRepositoryImpl(
      mockTaskLocalDataSource,
    );
  });

  group('taskRepositoryImpl', () {
    final testId = uuid.v7();

    final testTaskModel = TaskModel(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1');
    final testTaskModelList = [TaskModel(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1')];
    final testTaskEntity = TaskEntity(id: testId, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1');

    test('getTasks', () async {
      when(
        mockTaskLocalDataSource.getTasks(),
      ).thenAnswer((_) async => testTaskModelList);

      final categories = await taskRepositoryImpl.getTasks();

      verify(mockTaskLocalDataSource.getTasks()).called(1);
      expect(categories.length, 1);
      expect(categories[0].id, equals(testTaskModel.id));
      expect(categories[0].title, equals(testTaskModel.title));
    });

    test('getTaskById', () async {
      when(
        mockTaskLocalDataSource.getTaskById(testId),
      ).thenAnswer((_) async => testTaskModel);

      final result = await taskRepositoryImpl.getTaskById(testId);

      verify(mockTaskLocalDataSource.getTaskById(testId)).called(1);

      expect(result.id, equals(testTaskModel.id));
      expect(result.title, equals(testTaskModel.title));
    });
    test('createTask', () async {
      when(
        mockTaskLocalDataSource.createTask(any),
      ).thenAnswer((_) async => testId);

      final result = await taskRepositoryImpl.createTask(
        testTaskEntity,
      );

      verify(mockTaskLocalDataSource.createTask(any)).called(1);
      expect(result, equals(testId));
    });

    test('updateTask', () async {
      when(
        mockTaskLocalDataSource.updateTask(any),
      ).thenAnswer((_) async => {});

      await taskRepositoryImpl.updateTask(testTaskEntity);

      verify(mockTaskLocalDataSource.updateTask(any)).called(1);
    });

    test('deleteTask', () async {
      when(
        mockTaskLocalDataSource.deleteTask(testId),
      ).thenAnswer((_) async => {});

      await taskRepositoryImpl.deleteTask(testId);

      verify(mockTaskLocalDataSource.deleteTask(testId)).called(1);
    });
  });
}

`;