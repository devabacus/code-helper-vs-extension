import path from "path";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../generators/data_routine_generator";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../../interfaces/table_relation.interface";

export class UseCaseRelateRemoveTargetFromSourceGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName); // e.g., task_tag_map
    // Consistent with add.dart, creating a specific file name based on operation
    return path.join(this.structure.getDomainUseCasesPath(featurePath), snakeCaseEntityName, `remove_target_from_source.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const manyToManyRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate 'remove target from source' use case.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; 
    const intermediateSnake = toSnakeCase(intermediateUpper);

    const sourceUpper = cap(manyToManyRelation.sourceTable); 
    const sourceForeignKey = manyToManyRelation.sourceField; 

    const targetUpper = cap(manyToManyRelation.targetTable); 
    const targetForeignKey = manyToManyRelation.targetField; 

    return `
import '../../repositories/${intermediateSnake}_repository.dart';

class Remove${targetUpper}From${sourceUpper}UseCase {
  final I${intermediateUpper}Repository repository;

  Remove${targetUpper}From${sourceUpper}UseCase(this.repository);

  Future<void> call(String ${sourceForeignKey}, String ${targetForeignKey}) {
    return repository.remove${targetUpper}From${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }
}
`;
  }
}