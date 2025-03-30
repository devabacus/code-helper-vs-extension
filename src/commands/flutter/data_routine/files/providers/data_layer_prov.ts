import path from "path";
import { cap } from "../../../../../utils/text_work/text_util";

export const dataProvPath = (fPath: string, driftClassName: string) => path.join(fPath, "data", "providers", `${driftClassName}_data_providers.dart`);

export const dataProvCont = (driftClassName: string)=> {
    const d = driftClassName;
    const D = cap(driftClassName);
  
return `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../datasources/local/sources/${d}_local_data_source.dart';
import '../repositories/${d}_repository_impl.dart';
import '../../../../core/database/local/provider/database_provider.dart';
import '../../domain/repositories/${d}_repository.dart';

part '${d}_data_providers.g.dart';

@riverpod
${D}LocalDataSource ${d}LocalDataSource(Ref ref) {
  final db = ref.read(appDatabaseProvider);
  return ${D}LocalDataSource(db);
}

@riverpod
${D}Repository ${d}Repository(Ref ref) {
  final localDataSource = ref.read(${d}LocalDataSourceProvider);
  return ${D}RepositoryImpl(localDataSource);
}
`;};
