// universal_generator/manifests/index.ts

import { DictionaryPresets } from "../dictionary_presets";

export const allManifests = {
  // Манифест для базовой обработки проекта
  startProject: {
    dictionaries: DictionaryPresets.PROJECT_ONLY,
    scan_dirs: [
      'lib/',
      'server/',
      'flutter/',
      'data/',
      'domain/',
      'presentation/',
    ],
  },

  entity: {
    dictionaries: DictionaryPresets.ENTITY,
  },

  serverpod: {
    dictionaries: DictionaryPresets.PROJECT_ONLY,
  },

  deploy: {
    dictionaries: DictionaryPresets.PROJECT_ONLY,
  },

  manyToMany: {
    dictionaries: DictionaryPresets.M2M,
  },

} as const;

// Этот тип теперь будет автоматически сгенерирован на основе ключей объекта allManifests
export type FeatureName = keyof typeof allManifests;