import path from "path";
import { DefaultProjectStructure } from "../../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../../core/interfaces/project_structure";
import { DataRoutineGenerator } from "../../../../../../generators/data_routine_generator";
import { DriftClassParser } from "../drift_class_parser";


export class TableExtensionGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure){
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getTableExtension(featurePath), `${entityName}_table_extension.dart`);
    }
    
    protected getContent(parser: DriftClassParser): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const params = parser.fieldsSimple;

    return `
import '../../../../../../../core/database/local/database.dart';
import '../../../../models/${d}/${d}_model.dart';

extension ${D}TableDataExtensions on ${D}TableData {
  ${D}Model toModel() => ${D}Model(${params});
}

extension ${D}TableDataListExtensions on List<${D}TableData> {
  List<${D}Model> toModels() => map((data)=> data.toModel()).toList();
}

`;
    }
}

