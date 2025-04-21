export const testTaskLocalSourceExample = `import 'package:project_name/core/database/local/database.dart';
import 'package:project_name/features/feature_name/data/datasources/local/dao/task/task_dao.dart';
import 'package:project_name/features/feature_name/data/datasources/local/sources/task_local_data_source.dart';
import 'package:project_name/features/feature_name/data/models/task/task_model.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'task_local_data_source_test.mocks.dart';

@GenerateMocks([TaskDao])
void main() {
  late MockTaskDao mockTaskDao;
  late TaskLocalDataSource dataSource;

  setUp(() {
    mockTaskDao = MockTaskDao();
    dataSource = TaskLocalDataSource(mockTaskDao);
  });

  group('TaskLocalDataSource', () {
    final testTaskTableData = TaskTableData(id: 1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
   
    final testTaskModel = TaskModel(id: 1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
   
    final testTaskModelCompanion = TaskTableCompanion.insert(title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
   
    final testTaskModelWithId = TaskModel(id: 1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
   
    final testTaskTableDataList = [testTaskTableData];

    test('getTasks должен вернуть list of TaskModel', () async {
      when(
        mockTaskDao.getTasks(),
      ).thenAnswer((_) async => testTaskTableDataList);

      final result = await dataSource.getTasks();

      verify(mockTaskDao.getTasks()).called(1);
      expect(result.length, equals(1));
      expect(result[0].id, equals(testTaskModel.id));
      expect(result[0].title, equals(testTaskModel.title));
    });

    test('getTaskById должен вернуть TaskModel', () async {
      when(
        mockTaskDao.getTaskById(1),
      ).thenAnswer((_) async => testTaskTableData);

      final result = await dataSource.getTaskById(1);

      verify(mockTaskDao.getTaskById(1)).called(1);
      expect(result.id, equals(testTaskModel.id));
      expect(result.title, equals(testTaskModel.title));
    });

    test(
      'createTask should call taskDao.createTask and return id',
      () async {
        when(
          mockTaskDao.createTask(testTaskModelCompanion),
        ).thenAnswer((_) async => 1);

        final result = await dataSource.createTask(testTaskModel);

        verify(mockTaskDao.createTask(any)).called(1);
        expect(result, equals(1));
      },
    );

    test('updateTask should call taskDao.updateTask', () async {
      when(mockTaskDao.updateTask(any)).thenAnswer((_) async => {});

      await dataSource.updateTask(testTaskModelWithId);

      verify(mockTaskDao.updateTask(any)).called(1);
    });

    test('deleteTask should call taskDao.deleteTask', () async {
      when(mockTaskDao.deleteTask(1)).thenAnswer((_) async => {});

      await dataSource.deleteTask(1);

      verify(mockTaskDao.deleteTask(1)).called(1);
    });
  });
}


`;