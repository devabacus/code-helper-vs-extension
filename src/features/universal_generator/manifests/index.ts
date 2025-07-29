import { entityManifest } from './entity.manifest';
import { startProjectManifest } from './start_project.manifest';
import { manyToManyManifest } from './many_to_many.manifest';
import { serverpodManifest } from './serverpod.manifest';
import { serverpodDeployManifest } from './serverpod_deploy.manifest';

export const allManifests = {
  startProject: startProjectManifest,
  entity: entityManifest,
  serverpod: serverpodManifest,
  deploy: serverpodDeployManifest,
  manyToMany: manyToManyManifest,

} as const;

export type FeatureName = keyof typeof allManifests;