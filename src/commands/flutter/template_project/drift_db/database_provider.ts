import path from "path";

export const databaseProvPath = (rootPath: string) => path.join(rootPath, "lib", "core", "database", "local", "provider", "database_provider.dart");

export const dbProvider = `
import '../database.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

part 'database_provider.g.dart';

@riverpod
AppDatabase appDatabase(Ref ref) {
  ref.keepAlive();
  return AppDatabase();
}
`;