import path from "path";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { cap, toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../generators/data_routine_generator";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../../interfaces/table_relation.interface";

export class UseCaseRelateAddGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {

    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getDomainUseCasesPath(featurePath), snakeCaseEntityName,  `add.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const manyToManyRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate relate add use case.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap
    const intermediateSnake = toSnakeCase(intermediateUpper);

    const sourceUpper = cap(manyToManyRelation.sourceTable); // e.g., Task
    const sourceForeignKey = manyToManyRelation.sourceField; // e.g., taskId

    const targetUpper = cap(manyToManyRelation.targetTable); // e.g., Tag
    const targetForeignKey = manyToManyRelation.targetField; // e.g., tagId

    return `
import '../../repositories/${intermediateSnake}_repository.dart';

class Add${targetUpper}To${sourceUpper}UseCase {
  final I${intermediateUpper}Repository repository;

  const Add${targetUpper}To${sourceUpper}UseCase(this.repository);

  Future<void> call(String ${sourceForeignKey}, String ${targetForeignKey}) {
    return repository.add${targetUpper}To${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }
}
`;
  }
}