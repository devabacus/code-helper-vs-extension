import path from "path";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure"; //
import { IFileSystem } from "../../../../../../../core/interfaces/file_system"; //
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure"; //
import { pluralConvert, cap } from "../../../../../../../utils/text_work/text_util"; //
import { DataRoutineGenerator } from "../../../../../generators/data_routine_generator"; //
import { DriftClassParser, Field as DriftClassField } from "../tables/drift_class_parser"; //
import { Reference } from "../../../../../../../core/interfaces/drift_table_parser"; //
import { DriftTableParser } from "../tables/drift_table_parser";

export class DataDaoGenerator extends DataRoutineGenerator {

    private structure: ProjectStructure;

    constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure(); //
    }

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(this.structure.getDaoPath(featurePath), entityName, `${entityName}_dao.dart`); //
    }

    protected getContent(data: { classParser: DriftClassParser, tableParser: DriftTableParser }): string {
        const classParser = data.classParser;
        const tableParser = data.tableParser;       
        const d = classParser.driftClassNameLower;
        const D = classParser.driftClassNameUpper;
        const Ds = pluralConvert(D); //

        let foreignKeyMethods = '';
        // Проверяем, что tableParser действительно был передан
        if (tableParser) {
            const references: Reference[] = tableParser.getReferences(); //

            if (references && references.length > 0) {
                foreignKeyMethods = references.map(ref => {
                    const fkFieldName = ref.columnName;
                    let methodNamePart = cap(fkFieldName); //
                    if (methodNamePart.endsWith('Id')) {
                        methodNamePart = methodNamePart.slice(0, -2);
                    }
                    
                    const fkFieldDetails = classParser.fields.find(f => f.name === fkFieldName); //
                    const fkFieldType = fkFieldDetails ? fkFieldDetails.type : 'String';
                    const paramNullableMarker = fkFieldDetails && fkFieldDetails.isNullable ? '?' : '';

                    const nullCheckLogic = fkFieldDetails?.isNullable 
                        ? `if (${fkFieldName} == null) {
      return []; 
    }\n    ` 
                        : '';

                    return `
  Future<List<${D}TableData>> get${Ds}By${methodNamePart}Id(${fkFieldType}${paramNullableMarker} ${fkFieldName}) async {
    ${nullCheckLogic}return (select(${d}Table)..where((t) => t.${fkFieldName}.equals(${fkFieldName}))).get();
  }
`;
                }).join('');
            }
        } 
        
        return `import 'package:uuid/uuid.dart';
import 'package:drift/drift.dart';

import '../../../../../../../core/database/local/interface/i_database_service.dart';
import '../../../../../../../core/database/local/database.dart';
import '../../tables/${d}_table.dart';

part '${d}_dao.g.dart';

@DriftAccessor(tables: [${D}Table])
class ${D}Dao extends DatabaseAccessor<AppDatabase>
    with _$${D}DaoMixin {
  final Uuid _uuid = Uuid();

  ${D}Dao(IDatabaseService databaseService)
    : super(databaseService.database);

  Future<List<${D}TableData>> get${Ds}() =>
      select(${d}Table).get();

  Stream<List<${D}TableData>> watch${Ds}() =>
      select(${d}Table).watch();

  Future<${D}TableData> get${D}ById(String id) =>
      (select(${d}Table)..where((t) => t.id.equals(id))).getSingle();
${foreignKeyMethods}
  Future<String> create${D}(${D}TableCompanion companion) async {
    String idToInsert;
    ${D}TableCompanion companionForInsert;

    if (companion.id.present && companion.id.value != null && companion.id.value.isNotEmpty) {
      idToInsert = companion.id.value;
      companionForInsert = companion;
    } else {
      idToInsert = _uuid.v7();
      companionForInsert = companion.copyWith(id: Value(idToInsert));
    }

    await into(${d}Table).insert(companionForInsert);
    return idToInsert;
  }

  Future<bool> update${D}(${D}TableCompanion ${d}) =>
    update(${d}Table).replace(${d});

  Future<bool> delete${D}(String id) async {
    final result =
        await (delete(${d}Table)..where((t) => t.id.equals(id))).go();
    return result > 0;
  }
}
`;
    }
}