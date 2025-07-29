import { DictionaryPresets } from "../dictionary_presets";

export const startProjectManifest = {
  baseFiles: {
      dictionaries: DictionaryPresets.PROJECT_ONLY,

      dirs: [
        'lib/core/',
        'presentation/routing/',
        'presentation/services/',
      ],

      files: [
        'flutter/_service_files/flutter_handle.ps1',
        'flutter/.gitignore',
        'lib/main.dart',
        'lib/app.dart',
        'lib/auth_wrapper.dart',
        'lib/check/server_check_ui.dart',
      ]
  },

  exclude: [
    'lib/core/data/datasources/local/database.dart',
    'lib/core/config/test_config.dart'

  ],

  replace: [],
  templated: [],

} as const;