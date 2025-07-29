import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type";

export const serverpodDeployManifest = {
  static: [

  ],
  
    customFiles: [
    {
      files: [
        'server/server_data.yaml',
        
    ],
      dictionaries: DictionaryPresets.PROJECT_ONLY 
    }
  ] as CustomFileGroup[],

  templated: [],
} as const; 

