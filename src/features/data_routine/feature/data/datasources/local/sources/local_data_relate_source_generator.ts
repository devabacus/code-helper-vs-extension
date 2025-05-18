import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { DriftClassParser } from "../tables/drift_class_parser";
import { DriftTableParser } from "../tables/drift_table_parser";
import { RelationType } from "../../../../../interfaces/table_relation.interface";

export class DataLocalRelateSourceGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    // entityName is intermediate table name like "taskTagMap"
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(featurePath, "data", "datasources", "local", "sources", `${snakeCaseEntityName}_local_data_source.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const relations = tableParser.getTableRelations();
    const manyToManyRelation = relations.find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate related local data source implementation.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap
    const intermediateSnake = toSnakeCase(intermediateUpper); // e.g., task_tag_map
    const daoName = `${intermediateUpper}Dao`;
    const daoVar = `_${unCap(daoName)}`;

    const sourceUpper = cap(manyToManyRelation.sourceTable); // e.g., Task
    const sourceSnake = toSnakeCase(manyToManyRelation.sourceTable); // e.g., task
    const sourceForeignKey = manyToManyRelation.sourceField; // e.g., taskId

    const targetUpper = cap(manyToManyRelation.targetTable); // e.g., Tag
    const targetPlural = pluralConvert(targetUpper); // e.g., Tags
    const targetSnake = toSnakeCase(manyToManyRelation.targetTable); // e.g., tag
    const targetForeignKey = manyToManyRelation.targetField; // e.g., tagId

    const sourcePlural = pluralConvert(sourceUpper); // e.g., Tasks

    return `import '../../../../../../core/database/local/interface/i_database_service.dart';
import '../dao/${intermediateSnake}/${intermediateSnake}_dao.dart';
import '../interfaces/${intermediateSnake}_local_datasource_service.dart';
import '../tables/extensions/${targetSnake}_table_extension.dart';
import '../tables/extensions/${sourceSnake}_table_extension.dart';
import '../../../models/${targetSnake}/${targetSnake}_model.dart';
import '../../../models/${sourceSnake}/${sourceSnake}_model.dart';

class ${intermediateUpper}LocalDataSource implements I${intermediateUpper}LocalDataSource {
  final ${daoName} ${daoVar};

  ${intermediateUpper}LocalDataSource(IDatabaseService databaseService)
    : ${daoVar} = ${daoName}(databaseService);

  @override
  Future<List<${targetUpper}Model>> get${targetPlural}For${sourceUpper}(String ${sourceForeignKey}) async {
    final ${targetSnake}s = await ${daoVar}.get${targetPlural}For${sourceUpper}(${sourceForeignKey});
    return ${targetSnake}s.toModels();
  }

  @override
  Future<List<${sourceUpper}Model>> get${sourcePlural}With${targetUpper}(String ${targetForeignKey}) async {
    final ${sourceSnake}s = await ${daoVar}.get${sourcePlural}With${targetUpper}(${targetForeignKey});
    return ${sourceSnake}s.toModels();
  }

  @override
  Future<void> add${targetUpper}To${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) async {
    await ${daoVar}.add${targetUpper}To${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }

  @override
  Future<void> remove${targetUpper}From${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) async {
    await ${daoVar}.remove${targetUpper}From${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }

  @override
  Future<void> removeAll${targetPlural}From${sourceUpper}(String ${sourceForeignKey}) async {
    await ${daoVar}.removeAll${targetPlural}From${sourceUpper}(${sourceForeignKey});
  }
}
`;
  }
}