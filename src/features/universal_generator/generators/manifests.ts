import { DictionaryPresets } from "../dictionary_presets";

export const allManifests = {
  startProject: {
    dictionaries: DictionaryPresets.PROJECT_ONLY,
    scan_dirs: [
      'lib/',
      'server/',
      // 'lib/core/config/'
    ],
  },

  entity: {
    dictionaries: DictionaryPresets.ENTITY,
    scan_dirs: [
      'feature/'
    ]
  },

  manyToMany: {
    dictionaries: DictionaryPresets.M2M,
    scan_dirs: [
      'feature/'
    ]
  },

  deploy: {
    dictionaries: DictionaryPresets.PROJECT_ONLY,
    scan_dirs: [
      'server/',
    ],
  },

} as const;

export type FeatureName = keyof typeof allManifests;