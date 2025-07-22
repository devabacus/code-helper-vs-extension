import { authManifest } from './auth.manifest';
import { databaseManifest } from './database.manifest';
import { generalManifest } from './general.manifest';
import { routingManifest } from './routing.manifest';

export const allManifests = {
  auth: authManifest,
  database: databaseManifest,
  general: generalManifest,
  routing: routingManifest,
} as const;

export type FeatureName = keyof typeof allManifests;