// src/features/data_routine/feature/data/repositories/relation_repository_generator.ts
import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { RelationType, TableRelation } from "../../../interfaces/table_relation.interface";
import { unCap } from "../../../../../utils/text_work/text_util";

export class RelationRepositoryGenerator extends DataRoutineGenerator {
  private readonly structure: ProjectStructure;
  private readonly relation: TableRelation;

  constructor(fileSystem: IFileSystem, relation: TableRelation, structure?: ProjectStructure) {
    super(fileSystem);
    this.relation = relation;
    this.structure = structure || new DefaultProjectStructure();
  }

  async generate(featurePath: string, entityName: string, data?: any): Promise<void> {
    try {
      const filePath = this.getPath(featurePath, entityName);
      const content = this.getContent(data);
      
      // Создаем директорию при необходимости
      const dirPath = path.dirname(filePath);
      await this.fileSystem.createFolder(dirPath);
      
      // Создаем файл
      await this.fileSystem.createFile(filePath, content);
    } catch (error) {
      console.error(`Ошибка при генерации репозитория для ${entityName}:`, error);
      throw new Error(`Ошибка генерации ${entityName} в ${featurePath}: ${String(error)}`);
    }
  }

  protected getPath(featurePath: string, _entityName: string): string {
    // Используем имя промежуточной таблицы для имени файла с правильным форматированием
    const intermediateTableName = this.relation.intermediateTable || '';
    // Преобразуем имя из TaskTagMap в task_tag_map
    const snakeCaseName = intermediateTableName
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, ''); // Удаляем начальное подчеркивание, если оно есть
    
    const fileName = `${snakeCaseName}_repository_impl.dart`;
    
    // Используем структуру проекта для получения пути к репозиторию
    return path.join(this.structure.getDataRepositoryPath(featurePath), fileName);
  }

  protected getContent(_data?: any): string {
    // Используем данные из отношения
    const sourceName = this.relation.sourceTable;
    const targetName = this.relation.targetTable;
    const intermediateTable = this.relation.intermediateTable || `${sourceName}${targetName}Map`;
    const lowerIntermediate = unCap(intermediateTable).toLowerCase();
    
    // Импорты
    const sourceEntityImport = `../../domain/entities/${unCap(sourceName).toLowerCase()}/${unCap(sourceName).toLowerCase()}.dart`;
    const targetEntityImport = `../../domain/entities/${unCap(targetName).toLowerCase()}/${unCap(targetName).toLowerCase()}.dart`;
    const repositoryImport = `../../domain/repositories/${lowerIntermediate}_repository.dart`;
    const dataSourceImport = `../datasources/local/sources/${lowerIntermediate}_local_data_source.dart`;
    const sourceExtensionImport = `../models/extensions/${unCap(sourceName).toLowerCase()}_model_extension.dart`;
    const targetExtensionImport = `../models/extensions/${unCap(targetName).toLowerCase()}_model_extension.dart`;
    
    // Методы репозитория
    let methods = '';
    
    if (this.relation.relationType === RelationType.MANY_TO_MANY) {
      methods = this.generateManyToManyMethods(sourceName, targetName);
    } else if (this.relation.relationType === RelationType.ONE_TO_MANY) {
      methods = this.generateOneToManyMethods(sourceName, targetName);
    }
    
    return `
import '${sourceEntityImport}';
import '${targetEntityImport}';
import '${repositoryImport}';
import '${dataSourceImport}';
import '${sourceExtensionImport}';
import '${targetExtensionImport}';

class ${intermediateTable}RepositoryImpl implements ${intermediateTable}Repository {
  final ${intermediateTable}LocalDataSource _dataSource;

  ${intermediateTable}RepositoryImpl(this._dataSource);
${methods}
}
`;
  }
  
  private generateManyToManyMethods(sourceName: string, targetName: string): string {
    const sourceNameLower = unCap(sourceName);
    const targetNameLower = unCap(targetName);
    
    return `
  @override
  Future<List<${targetName}Entity>> get${targetName}sFor${sourceName}(int ${sourceNameLower}Id) async {
    final ${targetNameLower}Models = await _dataSource.get${targetName}sFor${sourceName}(${sourceNameLower}Id);
    return ${targetNameLower}Models.toEntities();
  }

  @override
  Future<List<${sourceName}Entity>> get${sourceName}sWith${targetName}(int ${targetNameLower}Id) async {
    final ${sourceNameLower}Models = await _dataSource.get${sourceName}sWith${targetName}(${targetNameLower}Id);
    return ${sourceNameLower}Models.toEntities();
  }

  @override
  Future<void> add${targetName}To${sourceName}(int ${sourceNameLower}Id, int ${targetNameLower}Id) async {
    await _dataSource.add${targetName}To${sourceName}(${sourceNameLower}Id, ${targetNameLower}Id);
  }

  @override
  Future<void> remove${targetName}From${sourceName}(int ${sourceNameLower}Id, int ${targetNameLower}Id) async {
    await _dataSource.remove${targetName}From${sourceName}(${sourceNameLower}Id, ${targetNameLower}Id);
  }

  @override
  Future<void> removeAll${targetName}sFrom${sourceName}(int ${sourceNameLower}Id) async {
    await _dataSource.removeAll${targetName}sFrom${sourceName}(${sourceNameLower}Id);
  }`;
  }
  
  private generateOneToManyMethods(sourceName: string, targetName: string): string {
    const sourceNameLower = unCap(sourceName);
    const targetNameLower = unCap(targetName);
    
    return `
  @override
  Future<${targetName}Entity?> get${targetName}For${sourceName}(int ${sourceNameLower}Id) async {
    final ${targetNameLower}Model = await _dataSource.get${targetName}For${sourceName}(${sourceNameLower}Id);
    return ${targetNameLower}Model?.toEntity();
  }

  @override
  Future<List<${sourceName}Entity>> get${sourceName}sWith${targetName}(int ${targetNameLower}Id) async {
    final ${sourceNameLower}Models = await _dataSource.get${sourceName}sWith${targetName}(${targetNameLower}Id);
    return ${sourceNameLower}Models.toEntities();
  }

  @override
  Future<void> set${targetName}For${sourceName}(int ${sourceNameLower}Id, int ${targetNameLower}Id) async {
    await _dataSource.set${targetName}For${sourceName}(${sourceNameLower}Id, ${targetNameLower}Id);
  }

  @override
  Future<void> clear${targetName}From${sourceName}(int ${sourceNameLower}Id) async {
    await _dataSource.clear${targetName}From${sourceName}(${sourceNameLower}Id);
  }`;
  }
}