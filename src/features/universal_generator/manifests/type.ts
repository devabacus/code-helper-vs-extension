import { DictionaryName } from "../replacement_util";

export interface CustomFileGroup {
  files: string[];
  dictionaries: readonly DictionaryName[];
}