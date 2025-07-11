import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

import { generatorConfig } from "../../../../../core/config/config";

export class LocalDataSourceServiceGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {

    return path.join(this.structure.getDataLocalInterfacesPath(featurePath), `${entityName}_local_datasource_service.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    // const projectName = new PathData(featurePath).projectName;
    const entity = model.className;
    const templEntity = generatorConfig.entityName;

    const sourceFilePath = path.join(this.structure.getDataLocalInterfacesPath(generatorConfig.sourceFeaturePath), `${templEntity}_local_datasource_service.dart`);

    // return entityReplacement(sourceFilePath, entity);
    return '';  

  }
}