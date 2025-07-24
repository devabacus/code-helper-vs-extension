import { cap, pluralConvert, toPascalCase, unCap } from "../../utils/text_work/text_util";
import { ReplacementRule } from "./generators/replacing_file_processor";
import { GenerationConfig } from "./generation_config";

export const Dictionaries = {
  COMMON: 'common',
  ENTITY: 'entity',
} as const;

export type DictionaryName = typeof Dictionaries[keyof typeof Dictionaries];

type RuleGenerator = (config: GenerationConfig) => ReplacementRule[];

const dictionaryRegistry: Record<DictionaryName, RuleGenerator> = {
  [Dictionaries.COMMON]: (config) => [
    { from: config.templProject, to: config.targetProject },
    // Сюда можно добавлять другие общие правила для проекта
  ],
  [Dictionaries.ENTITY]: (config) => {
    if (!config.targetEntity) {
      return [];
    }
    const baseForms = {
      Ds: pluralConvert(cap(config.templEntity)),
      D: cap(config.templEntity),
      d: unCap(config.templEntity),
    };

    const newForms = {
      Ds: pluralConvert(cap(config.targetEntity)),
      D: cap(config.targetEntity),
      d: unCap(config.targetEntity),
    };

    return [
      { from: baseForms.Ds, to: newForms.Ds },
      { from: baseForms.D, to: newForms.D },
      { from: baseForms.d, to: newForms.d },
    ];
  },
};


export function getDictionaryRules(dictionaries: readonly DictionaryName[], config: GenerationConfig): ReplacementRule[] {
  const allRules: ReplacementRule[] = [];

  for (const dictName of dictionaries) {
    const ruleGenerator = dictionaryRegistry[dictName];
    if (ruleGenerator) {
      // Вызываем генератор и добавляем его правила в общий массив
      allRules.push(...ruleGenerator(config));
    }
  }

  return allRules;
}