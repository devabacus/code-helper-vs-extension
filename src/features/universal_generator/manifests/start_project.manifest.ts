import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type";

export const startProjectManifest = {
  // ✅ Указываем корневые директории для статического копирования
  static_dirs: [
    'lib/core/',
    'presentation/routing/',
    'presentation/services/',
  ],

  // ✅ Здесь остаются только файлы вне директории /core
  static: [
    'flutter/_service_files/flutter_handle.ps1',
    'flutter/.gitignore',
    'lib/main.dart',
    'lib/app.dart',
    'lib/auth_wrapper.dart',
  ],

  // ✅ Указываем файл, который нужно проигнорировать
  exclude: [
    'lib/core/data/datasources/local/database.dart'
  ],

  replace: [],
  templated: [],

  customFiles: [
    {
      files: [
        'lib/check/server_check_ui.dart',
        'lib/core/providers/serverpod_client_provider.dart',
        'lib/core/providers/session_manager_provider.dart',
      ],
      dictionaries: DictionaryPresets.PROJECT_ONLY
    }
  ] as CustomFileGroup[]
} as const;