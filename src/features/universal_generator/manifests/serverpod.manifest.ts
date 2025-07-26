import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type";

export const serverpodManifest = {
  static: [
    // auth
    'lib/core/providers/serverpod_client_provider.dart',
    'lib/core/providers/session_manager_provider.dart',
    'server/lib/src/endpoints/shared/auth_context_mixin.dart',
    'server/lib/src/endpoints/user_manager_endpoint.dart',

    // models
    'server/lib/src/models/user/customer_user.spy.yaml',
    'server/lib/src/models/user/customer.spy.yaml',
    'server/lib/src/models/user/permission.spy.yaml',
    'server/lib/src/models/user/role_permission.spy.yaml',
    'server/lib/src/models/user/role.spy.yaml',
    'server/lib/src/models/user/user_session_data.spy.yaml',
    'server/lib/src/models/sync_event_type.spy.yaml',
    'server/lib/src/endpoints/test_data_endpoint.dart',
  ],
  
    customFiles: [
    {
      files: [
        'lib/check/server_check_ui.dart',
        'server/lib/server.dart',
    ],
      dictionaries: DictionaryPresets.PROJECT_ONLY 
    }
  ] as CustomFileGroup[],

  templated: [],
} as const; 

