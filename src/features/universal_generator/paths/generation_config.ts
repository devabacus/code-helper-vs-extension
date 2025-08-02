import path from "path";
import { FeatureName as ManifestTypeName } from "../generators/manifests";

// Простые файлы - только замена entity
export interface IGenerationConfig {
  targetProject: string;
  templProject: string;
  manifestType?: ManifestTypeName[];
  templFeatureName?: string;
  targetFeatureName?: string;
  projectsPath?: string;
  templEntity?: string;
  targetEntity?: string;
  targetEntity1?: string;
  targetEntity2?: string;
  sourceFeaturePath?: string;
}

export class GenerationConfig {
  public templProject: string;
  public targetProject: string;
  public projectsPath: string;
  public templEntity: string;
  public targetEntity: string;
  public targetEntity1: string;
  public targetEntity2: string;
  public sourceFeaturePath: string;
  public templFeatureName: string;
  public targetFeatureName: string;
  public manifestFeatures: ManifestTypeName[];

  constructor(config: IGenerationConfig) {
    this.templProject = config.templProject || 't2';
    this.targetProject = config.targetProject;
    this.manifestFeatures = config.manifestType || [];
    this.templFeatureName = config.templFeatureName || 'home';
    this.targetFeatureName = config.targetFeatureName || 'home';
    this.projectsPath = config.projectsPath || 'G:/Projects/Flutter/serverpod';
    this.templEntity = config.templEntity || 'category';
    this.targetEntity = config.targetEntity || '';
    this.targetEntity1 = config.targetEntity1 || '';
    this.targetEntity2 = config.targetEntity2 || '';
    this.sourceFeaturePath = config.sourceFeaturePath || `G:/Projects/Flutter/serverpod/${this.templProject}/${this.templProject}_flutter/lib/features/home`;
  }

  get getFeaturePath(): string {
    return path.join(this.projectsPath, this.targetProject, `${this.targetProject}_flutter`, 'lib', 'features', this.templFeatureName);
  }

  get targetFlutterProjectPath(): string { return this.getFlutterPath(this.targetProject); };
  get templFlutterProjectPath(): string { return this.getFlutterPath(this.templProject); };

  get targetFlutterLibPath(): string { return this.flutterLibPath(this.targetProject); };
  get templFlutterLibPath(): string { return this.flutterLibPath(this.templProject); }

  get targetServerProjectPath(): string {
    return path.join(this.projectsPath, `${this.targetProject}`, `${this.targetProject}_server`);
  }

  get templServerProjectPath(): string {
    return path.join(this.projectsPath, `${this.templProject}`, `${this.templProject}_server`);
  }

  get targetFeaturePath(): string {
    return path.join(this.targetFlutterProjectPath, 'lib', 'features', `${this.templFeatureName}`);
  }

  private getFlutterPath(projectName: string): string {
    return path.join(this.projectsPath, `${projectName}`, `${projectName}_flutter`);
  }

  flutterLibPath(project: string): string {
    return path.join(this.getFlutterPath(project), "lib");
  };

  get corePath(): string {
    return path.join(this.targetFlutterLibPath, 'core');
  }

  get coreDataLocalPath(): string {
    return path.join(this.corePath, 'data', 'datasources', 'local');
  }

  get coreTablesPath(): string {
    return path.join(this.coreDataLocalPath, 'tables');
  }

  get featureTablesPath(): string {
    return path.join(this.getFeaturePath, 'data', 'datasources', 'local', 'tables');
  }

  get monoRepoTargetPath(): string {
    return path.join(this.projectsPath, this.targetProject);
  }

  get monoRepoTemplPath(): string {
    return path.join(this.projectsPath, this.templProject);
  }
}
