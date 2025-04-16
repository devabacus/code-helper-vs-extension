import path from "path";
import { BaseGenerator } from "../../../core/generators/base_generator";

export class DatabaseProvider extends BaseGenerator {
  
    protected getPath(basePath: string): string {
        return path.join(basePath, "lib", "core", "database", "local", "provider", "database_provider.dart");
    }
  
  
    protected getContent(): string {
      return `import 'package:riverpod_annotation/riverpod_annotation.dart';
  import 'package:flutter_riverpod/flutter_riverpod.dart';
  
  import '../database.dart';
  import '../interface/i_database_service.dart';
  import '../services/database_service.dart';
  
  part 'database_provider.g.dart';
  
  @riverpod
  AppDatabase appDatabase(Ref ref) {
    ref.keepAlive();
    return AppDatabase();
  }
  
  @riverpod
  IDatabaseService databaseService(Ref ref) {
    ref.keepAlive();
    final database = ref.watch(appDatabaseProvider);
    return DriftDatabaseService(database);  
  }
  `;
    }
  }
  
