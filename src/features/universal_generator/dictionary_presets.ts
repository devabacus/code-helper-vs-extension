import { Dictionaries, DictionaryName } from "./replacement_util";

export const DictionaryPresets = {
  ENTITY: [Dictionaries.COMMON, Dictionaries.ENTITY],
  PROJECT_ONLY: [Dictionaries.COMMON],
} as const;

export type DictionaryPresetName = keyof typeof DictionaryPresets;