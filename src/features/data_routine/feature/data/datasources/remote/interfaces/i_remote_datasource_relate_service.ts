import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../../../utils/text_work/text_util";
import { PathData } from "../../../../../../utils/path_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class RemoteRelateSourceServiceGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy();
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataRemoteInterfacesPath(featurePath), `${entityName}_remote_datasource_service.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`;
    const className = unCap(ClassName);
    const ClassNameS = pluralConvert(ClassName);

    return `
import 'package:${projectName}_client/${projectName}_client.dart';

abstract class I${ClassName}RemoteDataSource {
  Future<List<${ClassName}>> get${ClassNameS}Since(DateTime? since);
  Stream<${ClassName}SyncEvent> watchEvents();
  Future<bool> checkConnection();
  Future<${ClassName}> create${ClassName}(${className});
  Future<bool> delete${ClassName}By${D1}And${D2}(UuidValue ${d1}Id, UuidValue ${d2}Id);
  Future<List<${D2}>> get${D2s}For${D1}(UuidValue ${d1}Id);
  Future<List<${D1}>> get${D1s}For${D2}(UuidValue ${d2}Id);
}
`;
  }
}