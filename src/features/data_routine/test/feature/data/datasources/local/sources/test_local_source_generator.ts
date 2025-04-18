import path from "path";
import { BaseGenerator } from "../../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../../core/interfaces/project_structure";
import { pluralConvert } from "../../../../../../../../utils/text_work/text_util";
import { DriftClassParser } from "../../../../../../feature/data/datasources/local/tables/drift_class_parser";

export class TestLocalSourceGenerator extends BaseGenerator {
       
    private structure: ProjectStructure;
    
      constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
        super(fileSystem);
        this.structure = structure || new DefaultProjectStructure();
      }

    protected getPath(featureTestPath: string, entityName: string): string {
        return path.join(this.structure.getLocalDataSourcePath(featureTestPath), entityName, `${entityName}_local_data_source_test.dart`);
    }
    
    protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
        const d = parser.driftClassNameLower;
        const D = parser.driftClassNameUpper;
        const Ds = pluralConvert(D);
        const projectPath = basePath.split('test');
        const projectName = path.basename(projectPath[0]);
        
        const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/core/database/local/database.dart';
import 'package:${projectName}/features/${featureName}/data/datasources/local/dao/${d}/${d}_dao.dart';
import 'package:${projectName}/features/${featureName}/data/datasources/local/sources/${d}_local_data_source.dart';
import 'package:${projectName}/features/${featureName}/data/models/${d}/${d}_model.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import '${d}_local_data_source_test.mocks.dart';

@GenerateMocks([${D}Dao])
void main() {
  late Mock${D}Dao mock${D}Dao;
  late ${D}LocalDataSource dataSource;

  setUp(() {
    mock${D}Dao = Mock${D}Dao();
    dataSource = ${D}LocalDataSource(mock${D}Dao);
  });

  group('${D}LocalDataSource', () {
    final test${D}TableData = ${D}TableData(
      id: 1,
      title: 'Test ${D}',
    );

    final test${D}Model = ${D}Model(id: 1, title: 'Test ${D}');

    final test${D}ModelCompanion = ${D}TableCompanion.insert(
      title: 'Test ${D}',
    );

    final test${D}ModelWithId = ${D}Model(
      id: 1,
      title: 'Test ${D}',
    );

    final test${D}TableDataList = [test${D}TableData];

    test('get${Ds} должен вернуть list of ${D}Model', () async {
      when(
        mock${D}Dao.get${Ds}(),
      ).thenAnswer((_) async => test${D}TableDataList);

      final result = await dataSource.get${Ds}();

      verify(mock${D}Dao.get${Ds}()).called(1);
      expect(result.length, equals(1));
      expect(result[0].id, equals(test${D}Model.id));
      expect(result[0].title, equals(test${D}Model.title));
    });

    test('get${D}ById должен вернуть ${D}Model', () async {
      when(
        mock${D}Dao.get${D}ById(1),
      ).thenAnswer((_) async => test${D}TableData);

      final result = await dataSource.get${D}ById(1);

      verify(mock${D}Dao.get${D}ById(1)).called(1);
      expect(result.id, equals(test${D}Model.id));
      expect(result.title, equals(test${D}Model.title));
    });

    test(
      'create${D} should call ${d}Dao.create${D} and return id',
      () async {
        when(
          mock${D}Dao.create${D}(test${D}ModelCompanion),
        ).thenAnswer((_) async => 1);

        final result = await dataSource.create${D}(test${D}Model);

        verify(mock${D}Dao.create${D}(any)).called(1);
        expect(result, equals(1));
      },
    );

    test('update${D} should call ${d}Dao.update${D}', () async {
      when(mock${D}Dao.update${D}(any)).thenAnswer((_) async => {});

      await dataSource.update${D}(test${D}ModelWithId);

      verify(mock${D}Dao.update${D}(any)).called(1);
    });

    test('delete${D} should call ${d}Dao.delete${D}', () async {
      when(mock${D}Dao.delete${D}(1)).thenAnswer((_) async => {});

      await dataSource.delete${D}(1);

      verify(mock${D}Dao.delete${D}(1)).called(1);
    });
  });
}

`;
    }
}
