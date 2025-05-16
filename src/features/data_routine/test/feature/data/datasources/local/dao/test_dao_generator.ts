import path from "path";
import { BaseGenerator } from "../../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../../utils/text_work/text_util";
import { DriftClassParser } from "../../../../../../feature/data/datasources/local/tables/drift_class_parser";

export class TestDaoGenerator extends BaseGenerator {
       
    private structure: ProjectStructure;
    
      constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
      }

    protected getPath(featureTestPath: string, entityName: string): string {
        return path.join(this.structure.getDaoPath(featureTestPath), `${entityName}_dao_test.dart`);
    }
    
    protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const ds = pluralConvert(d);
        const Ds = pluralConvert(D);
        const projectPath = basePath.split('test');
        const projectName = path.basename(projectPath[0]);
        const fields = parser.fieldsForTest;
        const wrappedFields = fields[2];
        const fieldsExpected = parser.fieldsExpectedForTest;
        
        const featureName = (projectPath[1]).split(path.sep)[2];
    return `
    import 'package:${projectName}/core/database/local/database.dart';
import 'package:${projectName}/features/${featureName}/data/datasources/local/dao/${d}/${d}_dao.dart';
import 'package:drift/drift.dart' hide isNotNull;
import 'package:flutter_test/flutter_test.dart';
import 'package:uuid/uuid.dart';

import '../../../../../../core/database/local/test_database_service.dart';

void main() {
  late TestDatabaseService databaseService;
  late ${D}Dao ${d}Dao;
  const uuid = Uuid();

  setUp(() {
    databaseService = TestDatabaseService();
    ${d}Dao = ${D}Dao(databaseService);
  });

  tearDown(() async {
    await databaseService.close();
  });

  group('${D}Dao', () {
    test('should create a new ${d}', () async {
      final testId = uuid.v7();
      final ${d}Companion = ${D}TableCompanion.insert(
        id: Value(testId),
        ${fields[0]}
      );

      final created${D}Id = await ${d}Dao.create${D}(
        ${d}Companion,
      );
      expect(created${D}Id, testId);

      final ${d}FromDb = await ${d}Dao.get${D}ById(testId);
      expect(${d}FromDb, isNotNull);
      expect(${d}FromDb.id, testId);
      expect(${d}FromDb${fieldsExpected[0]});
    });

    test('should get all ${ds}', () async {
      final id1 = uuid.v7();
      final id2 = uuid.v7();

      await ${d}Dao.create${D}(
        ${D}TableCompanion.insert(id: Value(id1), ${fields[0]}),
      );
      await ${d}Dao.create${D}(
        ${D}TableCompanion.insert(id: Value(id2), ${fields[1]}),
      );

      final ${ds} = await ${d}Dao.get${Ds}();

      expect(${ds}.length, 2);
      expect(
        ${ds}.any((item) => item.id == id1 && item${fieldsExpected[0].replace(',', ' ==')}),
        isTrue,
      );
      expect(
        ${ds}.any((item) => item.id == id2 && item${fieldsExpected[1].replace(',', ' ==')}),
        isTrue,
      );
    });

    test('should get ${d} by id', () async {
      final testId = uuid.v7();
      await ${d}Dao.create${D}(
        ${D}TableCompanion.insert(id: Value(testId), ${fields[0]}),
      );

      final ${d} = await ${d}Dao.get${D}ById(testId);

      expect(${d}, isNotNull);
      expect(${d}.id, testId);
      expect(${d}${fieldsExpected[0]});
    });

    test('should update ${d}', () async {
      final testId = uuid.v7();
      await ${d}Dao.create${D}(
        ${D}TableCompanion.insert(id: Value(testId), ${fields[0]}),
      );

      await ${d}Dao.update${D}(
        ${D}TableCompanion(
          ${wrappedFields}
        ),
      );

      final updated${D} = await ${d}Dao.get${D}ById(testId);
      expect(updated${D}, isNotNull);
      expect(updated${D}${fieldsExpected[1]});
    });

    test('should delete ${d}', () async {
      final testId = uuid.v7();
      await ${d}Dao.create${D}(
        ${D}TableCompanion.insert(
          id: Value(testId),
          ${fields[0]}
        ),
      );

      await ${d}Dao.delete${D}(testId);

      expect(
        () => ${d}Dao.get${D}ById(testId),
        throwsA(isA<StateError>()),
      );
    });
  });
}

  
`;
    }
}


  
//     import 'package:${projectName}/core/database/local/database.dart';
// import 'package:${projectName}/features/${featureName}/data/datasources/local/dao/${d}/${d}_dao.dart';
// import 'package:drift/drift.dart';
// import 'package:flutter_test/flutter_test.dart';

// import '../../../../../../core/database/local/test_database_service.dart';

// void main() {
//   late TestDatabaseService databaseService;
//   late ${D}Dao ${d}Dao;

//   setUp(() {
//     databaseService = TestDatabaseService();
//     ${d}Dao = ${D}Dao(databaseService);
//   });

//   tearDown(() async {
//     await databaseService.close();
//   });

//   group('${D}Dao', () {
//     test('should create a new ${d}', () async {
//       final ${d}Companion = ${D}TableCompanion.insert(
//         ${fields[0]}
//       );

//       final ${d}Id = await ${d}Dao.create${D}(${d}Companion);

//       expect(${d}Id, 1);
//     });

//     test('should get all ${ds}', () async {
//       await ${d}Dao.create${D}(
//         ${D}TableCompanion.insert(${fields[0]}),
//       );
//       await ${d}Dao.create${D}(
//         ${D}TableCompanion.insert(${fields[1]}),
//       );

//       final ${ds} = await ${d}Dao.get${Ds}();

//       expect(${ds}.length, 2);
//       expect(${ds}[0]${fieldsExpected[0]});
//       expect(${ds}[1]${fieldsExpected[1]});
//     });

//     test('should get ${d} by id', () async {
//       await ${d}Dao.create${D}(
//         ${D}TableCompanion.insert(
//         ${fields[0]})
//       );

//       final ${d} = await ${d}Dao.get${D}ById(1);

//       expect(${d}.id, 1);
//       expect(${d}${fieldsExpected[0]});
//     });

//     test('should update ${d}', () async {
//       await ${d}Dao.create${D}(
//         ${D}TableCompanion.insert(${fields[0]}),
//       );

//       await ${d}Dao.update${D}(
//         ${D}TableCompanion(
//           ${wrappedFields}
//         ),
//       );

//       final updated${D} = await ${d}Dao.get${D}ById(1);

//       expect(updated${D}${fieldsExpected[1]});
//     });

//     test('should delete ${d}', () async {
//       await ${d}Dao.create${D}(
//         ${D}TableCompanion.insert(${fields[0]}),
//       );

//       await ${d}Dao.delete${D}(1);

//       expect(() => ${d}Dao.get${D}ById(1), throwsA(isA<StateError>()));
//     });
//   });
// }
