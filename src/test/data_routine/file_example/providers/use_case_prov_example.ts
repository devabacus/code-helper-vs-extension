export const useCaseCategoryProviderExample = `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../usecases/category/create.dart';
import '../usecases/category/delete.dart';
import '../usecases/category/update.dart';
import '../usecases/category/get_all.dart';
import '../usecases/category/get_by_id.dart';
import '../../data/providers/category_data_providers.dart';

part 'category_usecase_providers.g.dart';

@riverpod
GetCategoriesUseCase getCategoriesUseCase(Ref ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return GetCategoriesUseCase(repository);
}

@riverpod
CreateCategoryUseCase createCategoryUseCase(Ref ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return CreateCategoryUseCase(repository);
}

@riverpod
DeleteCategoryUseCase deleteCategoryUseCase(Ref ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return DeleteCategoryUseCase(repository);
}

@riverpod
UpdateCategoryUseCase updateCategoryUseCase(Ref ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return UpdateCategoryUseCase(repository);
}

@riverpod
GetCategoryByIdUseCase getCategoryByIdUseCase(Ref ref) {
  final repository = ref.read(categoryRepositoryProvider);
  return GetCategoryByIdUseCase(repository);
}

`;


export const useCaseTagProviderExample = `
import 'package:flutter_riverpod/flutter_riverpod.dart';ivan
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../usecases/tag/create.dart';
import '../usecases/tag/delete.dart';
import '../usecases/tag/update.dart';
import '../usecases/tag/get_all.dart';
import '../usecases/tag/get_by_id.dart';
import '../../data/providers/tag_data_providers.dart';

part 'tag_usecase_providers.g.dart';

@riverpod
GetTagUseCase getTagUseCase(Ref ref) {
  final repository = ref.read(tagRepositoryProvider);
  return GetTagUseCase(repository);
}

@riverpod
CreateTagUseCase createTagUseCase(Ref ref) {
  final repository = ref.read(tagRepositoryProvider);
  return CreateTagUseCase(repository);
}

@riverpod
DeleteTagUseCase deleteTagUseCase(Ref ref) {
  final repository = ref.read(tagRepositoryProvider);
  return DeleteTagUseCase(repository);
}

@riverpod
UpdateTagUseCase updateTagUseCase(Ref ref) {
  final repository = ref.read(tagRepositoryProvider);
  return UpdateTagUseCase(repository);
}

@riverpod
GetTagByIdUseCase getTagByIdUseCase(Ref ref) {
  final repository = ref.read(tagRepositoryProvider);
  return GetTagByIdUseCase(repository);
}

`;