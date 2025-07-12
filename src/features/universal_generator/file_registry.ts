import path from "path";

// Простые файлы - только замена entity
export interface IGeneratorConfig {
  projectName: string;
  featureName: string
  projectsPath?: string;
  templEntityName?: string;
  sourceFeaturePath?: string; 
}

export class GeneratorConfig {

  public projectName: string;
  public projectsPath: string;
  public templEntity: string;
  public sourceFeaturePath: string;
  public featureName: string;

  constructor(config: IGeneratorConfig){
    this.projectName = config.projectName;
    this.featureName = config.featureName;
    this.projectsPath = config.projectsPath || 'G:/Projects/Flutter/serverpod';
    this.templEntity = config.templEntityName || 'category';
    this.sourceFeaturePath = config.sourceFeaturePath || 'G:/Projects/Flutter/serverpod/t2/t2_flutter/lib/features/home';
  }

  get getFeaturePath():string {
  return path.join(this.projectsPath, this.projectName, `${this.projectName}_flutter`, 'lib', 'features', this.featureName);
  
}

}
