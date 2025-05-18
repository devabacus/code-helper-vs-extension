export const dataProviderRelateExample = `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../../../../../core/database/local/provider/database_provider.dart';
import '../../../domain/repositories/task_tag_map_repository.dart';
import '../../datasources/local/interfaces/task_tag_map_local_datasource_service.dart';
import '../../datasources/local/sources/task_tag_map_local_data_source.dart';
import '../../repositories/task_tag_map_repository_impl.dart';

part 'task_tag_map_data_providers.g.dart';

@riverpod
ITaskTagMapLocalDataSource taskTagMapLocalDataSource(Ref ref) {
  final databaseService = ref.read(databaseServiceProvider);
  return TaskTagMapLocalDataSource(databaseService);
}

@riverpod
ITaskTagMapRepository taskTagMapRepository(Ref ref) {
  final localDataSource = ref.read(taskTagMapLocalDataSourceProvider);
  return TaskTagMapRepositoryImpl(localDataSource);
}

`;