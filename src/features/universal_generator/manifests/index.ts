import { databaseManifest } from './database.manifest';
import { entityManifest } from './entity.manifest';
import { generalManifest } from './general.manifest';
import { manyToManyManifest } from './many_to_many.manifest';
import { routingManifest } from './routing.manifest';
import { serverpodManifest } from './serverpod.manifest';
import { uiManifest } from './ui.manifest';

export const allManifests = {
  database: databaseManifest,
  general: generalManifest,
  routing: routingManifest,
  ui: uiManifest,
  entity: entityManifest,
  serverpod: serverpodManifest,
  manyToMany: manyToManyManifest,
} as const;

export type FeatureName = keyof typeof allManifests;