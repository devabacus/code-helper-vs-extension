import path from "path";
import { cap, pluralConvert } from "@utils";


export const useCaseProvPath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "providers", `${driftClassName}_usecase_providers.dart`);


export const usecaseProvCont = (driftClassName: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);
  const Ds = pluralConvert(D);

  return `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../usecases/${d}/create.dart';
import '../usecases/${d}/delete.dart';
import '../usecases/${d}/update.dart';
import '../usecases/${d}/get_all.dart';
import '../usecases/${d}/get_by_id.dart';
import '../../data/providers/${d}_data_providers.dart';

part '${d}_usecase_providers.g.dart';

@riverpod
Get${Ds}UseCase get${Ds}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Get${Ds}UseCase(repository);
}

@riverpod
Create${D}UseCase create${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Create${D}UseCase(repository);
}

@riverpod
Delete${D}UseCase delete${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Delete${D}UseCase(repository);
}

@riverpod
Update${D}UseCase update${D}UseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Update${D}UseCase(repository);
}

@riverpod
Get${D}ByIdUseCase get${D}ByIdUseCase(Ref ref) {
  final repository = ref.read(${d}RepositoryProvider);
  return Get${D}ByIdUseCase(repository);
}

`;
};
