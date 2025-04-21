export const testTaskRepostitoryImplExample = `import 'package:project_name/features/feature_name/data/datasources/local/interfaces/task_local_datasource_service.dart';
import 'package:project_name/features/feature_name/data/models/task/task_model.dart';
import 'package:project_name/features/feature_name/data/repositories/task_repository_impl.dart';
import 'package:project_name/features/feature_name/domain/entities/task/task.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'task_repository_impl_test.mocks.dart';


@GenerateMocks([ITaskLocalDataSource])
void main() {

    late MockITaskLocalDataSource mockTaskLocalDataSource;
    late TaskRepositoryImpl taskRepositoryImpl;


    setUp((){
      mockTaskLocalDataSource = MockITaskLocalDataSource();
      taskRepositoryImpl = TaskRepositoryImpl(mockTaskLocalDataSource);
    });

    group('taskRepositoryImpl',(){

      final testTaskModel = TaskModel(id: 1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
      final testTaskModelList = [TaskModel(id: 1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1)];
      final testTaskEntity = TaskEntity(id: -1, title: 'title 1', description: 'description 1', duration: 1, createdAt: DateTime(1), dueDateTime: DateTime(1), categoryId: 1);
      
      test('getTasks', () async{
          when(mockTaskLocalDataSource.getTasks()).thenAnswer((_)async=>testTaskModelList);

          final categories = await taskRepositoryImpl.getTasks();

          verify(mockTaskLocalDataSource.getTasks()).called(1);
          expect(categories.length, 1);
          expect(categories[0].id, equals(testTaskModel.id));
          expect(categories[0].title, equals(testTaskModel.title));
      });


      test('getTaskById', () async {
        when(mockTaskLocalDataSource.getTaskById(1)).thenAnswer((_)async=>testTaskModel);

        final result = await taskRepositoryImpl.getTaskById(1);

        verify(mockTaskLocalDataSource.getTaskById(1)).called(1);
        
        expect(result.id, equals(testTaskModel.id));
        expect(result.title, equals(testTaskModel.title));
        
      });
            test('createTask', () async {
        final expectedId = 1;

        when(mockTaskLocalDataSource.createTask(any))
            .thenAnswer((_) async => expectedId);

        final result = await taskRepositoryImpl.createTask(testTaskEntity);

        verify(mockTaskLocalDataSource.createTask(any)).called(1);
        expect(result, equals(expectedId));
      });

      test('updateTask', () async {
        when(mockTaskLocalDataSource.updateTask(any))
            .thenAnswer((_) async => {});

        await taskRepositoryImpl.updateTask(testTaskEntity);

        verify(mockTaskLocalDataSource.updateTask(any)).called(1);
      });

      test('deleteTask', () async {
        
        final taskId = 1;

        when(mockTaskLocalDataSource.deleteTask(taskId))
            .thenAnswer((_) async => {});

        await taskRepositoryImpl.deleteTask(taskId);

        verify(mockTaskLocalDataSource.deleteTask(taskId)).called(1);
      });

    });

}


`;