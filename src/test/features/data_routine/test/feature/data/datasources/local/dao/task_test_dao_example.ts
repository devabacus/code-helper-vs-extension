export const testTaskDaoExample = `import 'package:a13/core/database/local/database.dart';
import 'package:a13/features/home/data/datasources/local/dao/task/task_dao.dart';
import 'package:drift/drift.dart';
import 'package:flutter_test/flutter_test.dart';

import '../../../../../../core/database/local/test_database_service.dart';

void main() {
  late TestDatabaseService databaseService;
  late TaskDao taskDao;

  setUp(() {
    databaseService = TestDatabaseService();
    taskDao = TaskDao(databaseService);
  });

  tearDown(() async {
    await databaseService.close();
  });

  group('TaskDao', () {
    test('should create a new task', () async {
      final taskCompanion = TaskTableCompanion.insert(
        title: 'title 1',
        description: 'description 1',
        duration: 1,
        createdAt: DateTime(1),
        dueDateTime: DateTime(1),
        categoryId: 1,
      );

      final taskId = await taskDao.createTask(taskCompanion);

      expect(taskId, 1);
    });

    test('should get all tasks', () async {
      await taskDao.createTask(
        TaskTableCompanion.insert(
          title: 'title 1',
          description: 'description 1',
          duration: 1,
          createdAt: DateTime(1),
          dueDateTime: DateTime(1),
          categoryId: 1,
        ),
      );
      await taskDao.createTask(
        TaskTableCompanion.insert(
          title: 'title 2',
          description: 'description 2',
          duration: 2,
          createdAt: DateTime(2),
          dueDateTime: DateTime(2),
          categoryId: 2,
        ),
      );

      final tasks = await taskDao.getTasks();

      expect(tasks.length, 2);
      expect(tasks[0].title, 'title 1');
      expect(tasks[1].title, 'Test Task 2');
    });

    test('should get task by id', () async {
      await taskDao.createTask(
        TaskTableCompanion.insert(
          title: 'title 1',
          description: 'description 1',
          duration: 1,
          createdAt: DateTime(1),
          dueDateTime: DateTime(1),
          categoryId: 1,
        ),
      );

      final task = await taskDao.getTaskById(1);

      expect(task.id, 1);
      expect(task.title, 'title 1');
    });

    test('should update task', () async {
      await taskDao.createTask(
        TaskTableCompanion.insert(
          title: 'title 1',
          description: 'description 1',
          duration: 1,
          createdAt: DateTime(1),
          dueDateTime: DateTime(1),
          categoryId: 1,
        ),
      );

      await taskDao.updateTask(
        TaskTableCompanion(
          id: Value(1),
          title: Value('title 2'),
          description: Value('description 2'),
          duration: Value(2),
          createdAt: Value(DateTime(2)),
          dueDateTime: Value(DateTime(2)),
          categoryId: Value(2),
        ),
      );

      final updatedTask = await taskDao.getTaskById(1);

      expect(updatedTask.title, 'title 2');
    });

    test('should delete task', () async {
      await taskDao.createTask(
        TaskTableCompanion.insert(
          title: 'title 1',
          description: 'description 1',
          duration: 1,
          createdAt: DateTime(1),
          dueDateTime: DateTime(1),
          categoryId: 1,
        ),
      );

      await taskDao.deleteTask(1);

      expect(() => taskDao.getTaskById(1), throwsA(isA<StateError>()));
    });
  });
}
`;