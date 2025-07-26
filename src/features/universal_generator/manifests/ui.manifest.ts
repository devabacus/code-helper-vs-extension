import { DictionaryPresets } from "../dictionary_presets";
import { Dictionaries } from "../replacement_util";
import { CustomFileGroup } from "./type";

export const uiManifest = {
  static: [
    'lib/main.dart',
    'lib/app.dart',
    'lib/auth_wrapper.dart',
  ],
  
    customFiles: [
    {
      files: ['lib/check/server_check_ui.dart'],
      dictionaries: DictionaryPresets.PROJECT_ONLY 
    }
  ] as CustomFileGroup[],

  templated: [],
} as const; 

