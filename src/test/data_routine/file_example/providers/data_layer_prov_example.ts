export const dataLayerProviderExample = `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../datasources/local/sources/category_local_data_source.dart';
import '../repositories/category_repository_impl.dart';
import '../../../../core/database/local/provider/database_provider.dart';
import '../../domain/repositories/category_repository.dart';

part 'category_data_providers.g.dart';

@riverpod
CategoryLocalDataSource categoryLocalDataSource(Ref ref) {
  final db = ref.read(appDatabaseProvider);
  return CategoryLocalDataSource(db);
}

@riverpod
CategoryRepository categoryRepository(Ref ref) {
  final localDataSource = ref.read(categoryLocalDataSourceProvider);
  return CategoryRepositoryImpl(localDataSource);
}
`;