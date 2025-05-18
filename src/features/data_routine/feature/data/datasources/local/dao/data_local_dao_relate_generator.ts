import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, toSnakeCase, unCap } from "../../../../../../../utils/text_work/text_util";
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator";
import { DriftClassParser } from "../tables/drift_class_parser";
import { DriftTableParser } from "../tables/drift_table_parser";
import { RelationType } from "../../../../../interfaces/table_relation.interface";


export class DataDaoRelateGenerator extends DataRoutineGenerator {


  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featurePath: string, entityName: string): string {
    const snakeCaseEntityName = toSnakeCase(entityName); // entityName is intermediate table name like "taskTagMap"
    return path.join(this.structure.getDaoPath(featurePath), snakeCaseEntityName, `${snakeCaseEntityName}_dao.dart`);
  }

  protected getContent(parser: DriftClassParser): string {
    const tableParser = new DriftTableParser(parser.driftClass);
    const relations = tableParser.getTableRelations();
    const manyToManyRelation = relations.find(r => r.relationType === RelationType.MANY_TO_MANY);

    if (!manyToManyRelation) {
      throw new Error(`Could not find MANY_TO_MANY relation for table ${parser.driftClassNameUpper}`);
    }

    const intermediateUpper = parser.driftClassNameUpper; // e.g., TaskTagMap
    const intermediateLower = parser.driftClassNameLower; // e.g., taskTagMap
    const intermediateTableVar = `${intermediateLower}Table`; // e.g., taskTagMapTable
    const intermediateSnake = toSnakeCase(intermediateUpper); // e.g., task_tag_map

    const sourceUpper = cap(manyToManyRelation.sourceTable); // e.g., Task
    const sourceLower = unCap(manyToManyRelation.sourceTable); // e.g., task
    const sourceTableVar = `${sourceLower}Table`; // e.g., taskTable
    const sourcePlural = pluralConvert(sourceUpper); // e.g., Tasks
    const sourceSnake = toSnakeCase(manyToManyRelation.sourceTable); // e.g., task

    const targetUpper = cap(manyToManyRelation.targetTable); // e.g., Tag
    const targetLower = unCap(manyToManyRelation.targetTable); // e.g., tag
    const targetTableVar = `${targetLower}Table`; // e.g., tagTable
    const targetPlural = pluralConvert(targetUpper); // e.g., Tags
    const targetSnake = toSnakeCase(manyToManyRelation.targetTable); // e.g., tag

    const sourceForeignKey = manyToManyRelation.sourceField; // e.g., taskId
    const targetForeignKey = manyToManyRelation.targetField; // e.g., tagId

    return `import 'package:drift/drift.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../tables/${targetSnake}_table.dart';
import '../../tables/${sourceSnake}_table.dart';
import '../../tables/${intermediateSnake}_table.dart';

part '${intermediateSnake}_dao.g.dart';

@DriftAccessor(tables: [${intermediateUpper}Table, ${sourceUpper}Table, ${targetUpper}Table])
class ${intermediateUpper}Dao extends DatabaseAccessor<AppDatabase>
    with _$${intermediateUpper}DaoMixin {
  ${intermediateUpper}Dao(IDatabaseService databaseService)
    : super(databaseService.database);

  Future<List<${targetUpper}TableData>> get${targetPlural}For${sourceUpper}(String ${sourceForeignKey}) {
    return (select(${targetTableVar})..where(
      (t) => t.id.isInQuery(
        selectOnly(${intermediateTableVar})
          ..addColumns([${intermediateTableVar}.${targetForeignKey}])
          ..where(${intermediateTableVar}.${sourceForeignKey}.equals(${sourceForeignKey})),
      ),
    )).get();
  }

  Future<List<${sourceUpper}TableData>> get${sourcePlural}With${targetUpper}(String ${targetForeignKey}) {
    return (select(${sourceTableVar})..where(
      (t) => t.id.isInQuery(
        selectOnly(${intermediateTableVar})
          ..addColumns([${intermediateTableVar}.${sourceForeignKey}])
          ..where(${intermediateTableVar}.${targetForeignKey}.equals(${targetForeignKey})),
      ),
    )).get();
  }

  Future<void> add${targetUpper}To${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) {
    return into(${intermediateTableVar}).insert(${intermediateUpper}TableCompanion.insert(${sourceForeignKey}: ${sourceForeignKey}, ${targetForeignKey}: ${targetForeignKey}));
  }

  Future<void> remove${targetUpper}From${sourceUpper}(String ${sourceForeignKey}, String ${targetForeignKey}) {
    return (delete(${intermediateTableVar})..where((t) => t.${sourceForeignKey}.equals(${sourceForeignKey}) & t.${targetForeignKey}.equals(${targetForeignKey}))).go();
  }

  Future<void> removeAll${targetPlural}From${sourceUpper}(String ${sourceForeignKey}) {
    return (delete(${intermediateTableVar})..where((t) => t.${sourceForeignKey}.equals(${sourceForeignKey}))).go();
  }
}
`;
  }

}
