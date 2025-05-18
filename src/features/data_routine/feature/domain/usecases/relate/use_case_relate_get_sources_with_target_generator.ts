import path from "path";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../generators/data_routine_generator";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../../interfaces/table_relation.interface";

export class UseCaseRelateGetSourcesWithTargetGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName); // e.g., task_tag_map
    return path.join(this.structure.getDomainUseCasesPath(featurePath), snakeCaseEntityName, `get_sources_with_target.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const manyToManyRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate 'get sources with target' use case.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; 
    const intermediateSnake = toSnakeCase(intermediateUpper);

    const sourceUpper = cap(manyToManyRelation.sourceTable); 
    const sourceSnake = toSnakeCase(manyToManyRelation.sourceTable);
    const sourcePlural = pluralConvert(sourceUpper);

    const targetUpper = cap(manyToManyRelation.targetTable); 
    const targetForeignKey = manyToManyRelation.targetField;

    return `
import '../../entities/${sourceSnake}/${sourceSnake}.dart';
import '../../repositories/${intermediateSnake}_repository.dart';

class Get${sourceUpper}With${targetUpper}UseCase {
  final I${intermediateUpper}Repository repository;

  const Get${sourceUpper}With${targetUpper}UseCase(this.repository);

  Future<List<${sourceUpper}Entity>> call(String ${targetForeignKey}) {
    return repository.get${sourcePlural}With${targetUpper}(${targetForeignKey});
  }
}
`;
  }
}