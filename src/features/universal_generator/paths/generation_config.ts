import path from "path";
import { FeatureName } from "../generators/manifests";

// Простые файлы - только замена entity
export interface IGenerationConfig {
  targetProject: string;
  templProject: string;
  features?: FeatureName[];
  featureName?: string;
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
  public featureName: string;
  public features: FeatureName[];

  constructor(config: IGenerationConfig) {
    this.templProject = config.templProject || 't2';
    this.targetProject = config.targetProject;
    this.features = config.features || [];
    this.featureName = config.featureName || 'home';
    this.projectsPath = config.projectsPath || 'G:/Projects/Flutter/serverpod';
    this.templEntity = config.templEntity || 'category';
    this.targetEntity = config.targetEntity || '';
    this.targetEntity1 = config.targetEntity1 || '';
    this.targetEntity2 = config.targetEntity2 || '';
    this.sourceFeaturePath = config.sourceFeaturePath || `G:/Projects/Flutter/serverpod/${this.templProject}/${this.templProject}_flutter/lib/features/home`;
  }

  get getFeaturePath(): string {
    return path.join(this.projectsPath, this.targetProject, `${this.targetProject}_flutter`, 'lib', 'features', this.featureName);
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
    return path.join(this.targetFlutterProjectPath, 'lib', 'features', `${this.featureName}`);
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
