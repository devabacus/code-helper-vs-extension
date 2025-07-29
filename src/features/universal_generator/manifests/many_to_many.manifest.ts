import { DictionaryPresets } from "../dictionary_presets";
import { CustomFileGroup } from "./type";

export const manyToManyManifest = {
  manyToManyFiles: {
      dictionaries: DictionaryPresets.M2M,

      replace_dirs: [
        'data/',
        'domain/',
      ],

      replace: [],
      templated: [],
  },
  
  customFiles: [] as CustomFileGroup[], 
};