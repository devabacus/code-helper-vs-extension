import path from "path";
import { DefaultProjectStructure } from "../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, toSnakeCase, unCap } from "../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../generators/data_routine_generator";
import { DriftClassParser } from "../datasources/local/tables/drift_class_parser";
import { DriftTableParser } from "../datasources/local/tables/drift_table_parser";
import { RelationType } from "../../../interfaces/table_relation.interface";

export class DataRepositoryRelateImplGenerator extends DataRoutineGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName);
    return path.join(this.structure.getDataRepositoryPath(featurePath), `${snakeCaseEntityName}_repository_impl.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const relations = tableParser.getTableRelations();
    const manyToManyRelation = relations.find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper} to generate related data repository implementation.`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap
    const intermediateSnake = toSnakeCase(intermediateUpper); // e.g., task_tag_map
    const dataSourceInterfaceName = `I${intermediateUpper}LocalDataSource`;
    const dataSourceVar = `_${unCap(intermediateUpper)}DataSource`; // e.g. _taskTagMapDataSource, but example uses _dataSource

    const sourceUpper = cap(manyToManyRelation.sourceTable); // e.g., Task
    const sourceSnake = toSnakeCase(manyToManyRelation.sourceTable); // e.g., task
    const sourceForeignKey = manyToManyRelation.sourceField; // e.g., taskId

    const targetUpper = cap(manyToManyRelation.targetTable); // e.g., Tag
    const targetPlural = pluralConvert(targetUpper); // e.g., Tags
    const targetSnake = toSnakeCase(manyToManyRelation.targetTable); // e.g., tag
    const targetForeignKey = manyToManyRelation.targetField; // e.g., tagId

    const sourcePlural = pluralConvert(sourceUpper); // e.g., Tasks

    return `import '../models/extensions/${targetSnake}_model_extension.dart';
import '../../domain/entities/${targetSnake}/${targetSnake}.dart';
import '../../domain/entities/${sourceSnake}/${sourceSnake}.dart';
import '../../domain/repositories/${intermediateSnake}_repository.dart';
import '../datasources/local/interfaces/${intermediateSnake}_local_datasource_service.dart';
import '../models/extensions/${sourceSnake}_model_extension.dart';

class ${intermediateUpper}RepositoryImpl implements I${intermediateUpper}Repository {
  final ${dataSourceInterfaceName} _dataSource;

  ${intermediateUpper}RepositoryImpl(this._dataSource);

  @override
  Future<List<${targetUpper}Entity>> get${targetPlural}For${sourceUpper}(String ${sourceForeignKey}) async {
    final ${targetSnake}Models = await _dataSource.get${targetPlural}For${sourceUpper}(${sourceForeignKey});
    return ${targetSnake}Models.toEntities();
  }

  @override
  Future<List<${sourceUpper}Entity>> get${sourcePlural}With${targetUpper}(String ${targetForeignKey}) async {
    final ${sourceSnake}Models = await _dataSource.get${sourcePlural}With${targetUpper}(${targetForeignKey});
    return ${sourceSnake}Models.toEntities();
  }

  @override
  Future<void> add${targetUpper}To${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) async {
    await _dataSource.add${targetUpper}To${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }

  @override
  Future<void> remove${targetUpper}From${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) async {
    await _dataSource.remove${targetUpper}From${sourceUpper}(${sourceForeignKey}, ${targetForeignKey});
  }

  @override
  Future<void> removeAll${targetPlural}From${sourceUpper}(String ${sourceForeignKey}) async {
    await _dataSource.removeAll${targetPlural}From${sourceUpper}(${sourceForeignKey});
  }
}
`;
  }
}