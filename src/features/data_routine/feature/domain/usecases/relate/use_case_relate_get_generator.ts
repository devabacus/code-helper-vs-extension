import path from "path";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, toSnakeCase } from "../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../generators/data_routine_generator";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../../interfaces/table_relation.interface";

export class UseCaseRelateGetTargetsForSourceGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName); 
    return path.join(this.structure.getDomainUseCasesPath(featurePath), snakeCaseEntityName, `get_targets_for_source.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const manyToManyRelation = tableParser.getTableRelations().find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate 'get targets for source' use case.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; 
    const intermediateSnake = toSnakeCase(intermediateUpper);

    const sourceUpper = cap(manyToManyRelation.sourceTable); 
    const sourceForeignKey = manyToManyRelation.sourceField; 

    const targetUpper = cap(manyToManyRelation.targetTable); 
    const targetSnake = toSnakeCase(manyToManyRelation.targetTable);
    const targetPlural = pluralConvert(targetUpper);

    return `
import '../../entities/${targetSnake}/${targetSnake}.dart';
import '../../repositories/${intermediateSnake}_repository.dart';

class Get${targetPlural}For${sourceUpper}UseCase {
  final I${intermediateUpper}Repository repository;

  Get${targetPlural}For${sourceUpper}UseCase(this.repository);

  Future<List<${targetUpper}Entity>> call(String ${sourceForeignKey}) {
    return repository.get${targetPlural}For${sourceUpper}(${sourceForeignKey});
  }
}
`;
  }
}