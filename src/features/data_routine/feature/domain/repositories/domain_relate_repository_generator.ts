import path from "path";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { cap, pluralConvert, toSnakeCase } from "../../../../../utils/text_work/text_util";
import { DriftClassParser } from "../../data/datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../../data/datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../interfaces/table_relation.interface";


export class DomainRelateRepositoryGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // entityName is intermediate table name like "taskTagMap"
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getDomainRepositoryPath(featurePath), `${snakeCaseEntityName}_repository.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const relations = tableParser.getTableRelations();
    const manyToManyRelation = relations.find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate related domain repository interface.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap

    const sourceUpper = cap(manyToManyRelation.sourceTable); // e.g., Task
    const sourceSnake = toSnakeCase(manyToManyRelation.sourceTable); // e.g., task
    const sourceForeignKey = manyToManyRelation.sourceField; // e.g., taskId

    const targetUpper = cap(manyToManyRelation.targetTable); // e.g., Tag
    const targetPlural = pluralConvert(targetUpper); // e.g., Tags
    const targetSnake = toSnakeCase(manyToManyRelation.targetTable); // e.g., tag
    const targetForeignKey = manyToManyRelation.targetField; // e.g., tagId

    const sourcePlural = pluralConvert(sourceUpper); // e.g., Tasks

    return `
import '../entities/${targetSnake}/${targetSnake}.dart';
import '../entities/${sourceSnake}/${sourceSnake}.dart';

abstract class I${intermediateUpper}Repository {
  Future<List<${targetUpper}Entity>> get${targetPlural}For${sourceUpper}(String ${sourceForeignKey});
  Future<List<${sourceUpper}Entity>> get${sourcePlural}With${targetUpper}(String ${targetForeignKey});
  Future<void> add${targetUpper}To${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey});
  Future<void> remove${targetUpper}From${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey});
  Future<void> removeAll${targetPlural}From${sourceUpper}(String ${sourceForeignKey});
}
`;
  }
}