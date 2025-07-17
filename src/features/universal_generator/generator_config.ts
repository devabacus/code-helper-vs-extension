import path from "path";

// Простые файлы - только замена entity
export interface IGeneratorConfig {
  targetProject: string;
  templProject: string;
  featureName?: string;
  projectsPath?: string;
  templEntityName?: string;
  sourceFeaturePath?: string;
}

export class GeneratorConfig {
  public templProject: string;
  public targetProject: string;
  public projectsPath: string;
  public templEntity: string;
  public sourceFeaturePath: string;
  public featureName: string;

  constructor(config: IGeneratorConfig) {
    this.templProject = config.templProject || 't2';
    this.targetProject = config.targetProject;
    this.featureName = config.featureName || 'home';
    this.projectsPath = config.projectsPath || 'G:/Projects/Flutter/serverpod';
    this.templEntity = config.templEntityName || 'category';
    this.sourceFeaturePath = config.sourceFeaturePath || `G:/Projects/Flutter/serverpod/${this.templProject}/${this.templProject}_flutter/lib/features/home`;
  }

  get getFeaturePath(): string {
    return path.join(this.projectsPath, this.targetProject, `${this.targetProject}_flutter`, 'lib', 'features', this.featureName);

  }

  get targetFlutterProjectPath() : string { return this.getFlutterPath(this.targetProject);};
  get templFlutterProjectPath(): string { return this.getFlutterPath(this.templProject);};

  get targetFlutterRootPath(): string {return this.flutterRootPath(this.targetProject);};
  get templFlutterRootPath(): string {return this.flutterRootPath(this.templProject);}
  
  
  get targetServerProjectPath(): string{
    return path.join(this.projectsPath, `${this.targetProject}`, `${this.targetProject}_server`);
  }

  get templServerProjectPath(): string{
    return path.join(this.projectsPath, `${this.templProject}`, `${this.templProject}_server`);
  }



  
  
  get targetFeaturePath(): string {
    return path.join(this.targetFlutterProjectPath, 'lib', 'features', `${this.featureName}`);
  } 
  
  private getFlutterPath(projectName: string) : string{
    return path.join(this.projectsPath, `${projectName}`, `${projectName}_flutter`);
  }
  
  flutterRootPath(project: string): string { 
    return path.join(this.getFlutterPath(project), "lib");
  };



}
