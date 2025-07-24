import { authManifest } from './auth.manifest';
import { databaseManifest } from './database.manifest';
import { generalManifest } from './general.manifest';
import { routingManifest } from './routing.manifest';
import { uiManifest } from './ui.manifest';

export const allManifests = {
  auth: authManifest,
  database: databaseManifest,
  general: generalManifest,
  routing: routingManifest,
  ui: uiManifest
} as const;

export type FeatureName = keyof typeof allManifests;