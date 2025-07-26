import { authManifest } from './auth.manifest';
import { databaseManifest } from './database.manifest';
import { entityManifest } from './entity.manifest';
import { generalManifest } from './general.manifest';
import { routingManifest } from './routing.manifest';
import { serverpodManifest } from './serverpod.manifest';
import { uiManifest } from './ui.manifest';

export const allManifests = {
  auth: authManifest,
  database: databaseManifest,
  general: generalManifest,
  routing: routingManifest,
  ui: uiManifest,
  entity: entityManifest,
  serverpod: serverpodManifest
} as const;

export type FeatureName = keyof typeof allManifests;