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
  public templEntityName: string;
  public sourceFeaturePath: string;
  public featureName: string;

  constructor(config: IGeneratorConfig){
    this.projectName = config.projectName;
    this.featureName = config.featureName;
    this.projectsPath = config.projectsPath || 'G:/Projects/Flutter/serverpod';
    this.templEntityName = config.templEntityName || 'category';
    this.sourceFeaturePath = config.sourceFeaturePath || 'G:/Projects/Flutter/serverpod/t2/t2_flutter/lib/features/home';
  }

  get getFeaturePath():string {
  return path.join(this.projectsPath, this.projectName, `${this.projectName}_flutter`, 'lib', 'features', this.featureName);
  
}

}

export const SIMPLE_FILES = [
  'category_local_datasource_service.dart',
//   'category_remote_datasource_service.dart', 
//   'category_repository.dart',
//   'category_usecase_create.dart',
  // ... другие простые файлы
];

// Файлы с динамическим контентом
const PATTERN_FILES = [
  'category_table.dart',
  // 'category_model.dart',
  // 'category_dao.dart',
  // 'category_extension.dart',
  // ... файлы с генерируемыми секциями
];

// Все файлы для генерации
export const ALL_FILES = [...SIMPLE_FILES, ...PATTERN_FILES];

// Пути к файлам
export const FILE_REGISTRY: Record<string, string> = {
  'category_local_datasource_service.dart': 'data/datasources/local/interfaces/category_local_datasource_service.dart',
//   'category_table.dart': 'data/datasources/local/tables/category_table.dart',
//   'category_model.dart': 'data/models/category/category_model.dart',
  // ... все остальные пути
};            