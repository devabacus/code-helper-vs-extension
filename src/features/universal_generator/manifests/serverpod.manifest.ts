import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type";

export const serverpodManifest = {
  static: [
    
  ],
  
    customFiles: [
    {
      files: ['lib/check/server_check_ui.dart'],
      dictionaries: DictionaryPresets.PROJECT_ONLY 
    }
  ] as CustomFileGroup[],

  templated: [],
} as const; 

