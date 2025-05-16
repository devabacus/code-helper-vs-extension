export const testTaskDaoExample = `import 'package:project_name/core/database/local/database.dart';
import 'package:project_name/features/feature_name/data/datasources/local/dao/task/task_dao.dart';
import 'package:drift/drift.dart' hide isNotNull;
import 'package:flutter_test/flutter_test.dart';
import 'package:uuid/uuid.dart';

import '../../../../../../core/database/local/test_database_service.dart';

void main() {
  late TestDatabaseService databaseService;
  late TaskDao taskDao;
  const uuid = Uuid();

  setUp(() {
    databaseService = TestDatabaseService();
    taskDao = TaskDao(databaseService);
  });

  tearDown(() async {
    await databaseService.close();
  });

  group('TaskDao', () {
    test('should create a new task', () async {
      final testId = uuid.v7();
      final taskCompanion = TaskTableCompanion.insert(
        id: Value(testId),
        title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'
      );

      final createdTaskId = await taskDao.createTask(
        taskCompanion,
      );
      expect(createdTaskId, testId);

      final taskFromDb = await taskDao.getTaskById(testId);
      expect(taskFromDb, isNotNull);
      expect(taskFromDb.id, testId);
      expect(taskFromDb.title, 'title 1');
    });

    test('should get all tasks', () async {
      final id1 = uuid.v7();
      final id2 = uuid.v7();

      await taskDao.createTask(
        TaskTableCompanion.insert(id: Value(id1), title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'),
      );
      await taskDao.createTask(
        TaskTableCompanion.insert(id: Value(id2), title: 'title 2', description: 'description 2', duration: 2, createdAt: DateTime(2), dueDateTime: DateTime(2), categoryId: 'categoryId 2'),
      );

      final tasks = await taskDao.getTasks();

      expect(tasks.length, 2);
      expect(
        tasks.any((item) => item.id == id1 && item.title == 'title 1'),
        isTrue,
      );
      expect(
        tasks.any((item) => item.id == id2 && item.title == 'title 2'),
        isTrue,
      );
    });

    test('should get task by id', () async {
      final testId = uuid.v7();
      await taskDao.createTask(
        TaskTableCompanion.insert(id: Value(testId), title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'),
      );

      final task = await taskDao.getTaskById(testId);

      expect(task, isNotNull);
      expect(task.id, testId);
      expect(task.title, 'title 1');
    });

    test('should update task', () async {
      final testId = uuid.v7();
      await taskDao.createTask(
        TaskTableCompanion.insert(id: Value(testId), title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'),
      );

      await taskDao.updateTask(
        TaskTableCompanion(
          id: Value(testId), title: Value('title 2'), description: Value('description 2'), duration: Value(2), createdAt: Value(DateTime(2)), dueDateTime: Value(DateTime(2)), categoryId: Value('categoryId 2')
        ),
      );

      final updatedTask = await taskDao.getTaskById(testId);
      expect(updatedTask, isNotNull);
      expect(updatedTask.title, 'title 2');
    });

    test('should delete task', () async {
      final testId = uuid.v7();
      await taskDao.createTask(
        TaskTableCompanion.insert(
          id: Value(testId),
          title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 'categoryId 1'
        ),
      );

      await taskDao.deleteTask(testId);

      expect(
        () => taskDao.getTaskById(testId),
        throwsA(isA<StateError>()),
      );
    });
  });
}

`;