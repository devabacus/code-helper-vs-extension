import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { DriftClassParser } from "../../../../feature/data/datasources/local/tables/drift_class_parser";
import { pluralConvert } from "../../../../../../utils/text_work/text_util";


export class TestRepositoryImplGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featureTestPath: string, entityName: string): string {
    return path.join(this.structure.getDataRepositoryPath(featureTestPath), entityName, `${entityName}_repository_impl_test.dart`);
  }

  protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);
    const projectPath = basePath.split('test');
    const projectName = path.basename(projectPath[0]).replace(`_flutter`, '');
    const fields = parser.fieldsForTest;
    const firstRow = parser.fields[1].name;
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/features/${featureName}/data/datasources/local/interfaces/${d}_local_datasource_service.dart';
import 'package:${projectName}/features/${featureName}/data/models/${d}/${d}_model.dart';
import 'package:${projectName}/features/${featureName}/data/repositories/${d}_repository_impl.dart';
import 'package:${projectName}/features/${featureName}/domain/entities/${d}/${d}.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import '${d}_repository_impl_test.mocks.dart';

@GenerateMocks([I${D}LocalDataSource])
void main() {
  late MockI${D}LocalDataSource mock${D}LocalDataSource;
  late ${D}RepositoryImpl ${d}RepositoryImpl;
  const uuid = Uuid();

  setUp(() {
    mock${D}LocalDataSource = MockI${D}LocalDataSource();
    ${d}RepositoryImpl = ${D}RepositoryImpl(
      mock${D}LocalDataSource,
    );
  });

  group('${d}RepositoryImpl', () {
    final testId = uuid.v7();

    final test${D}Model = ${D}Model(id: testId, ${fields[0]});
    final test${D}ModelList = [${D}Model(id: testId, ${fields[0]})];
    final test${D}Entity = ${D}Entity(id: testId, ${fields[0]});

    test('get${Ds}', () async {
      when(
        mock${D}LocalDataSource.get${Ds}(),
      ).thenAnswer((_) async => test${D}ModelList);

      final categories = await ${d}RepositoryImpl.get${Ds}();

      verify(mock${D}LocalDataSource.get${Ds}()).called(1);
      expect(categories.length, 1);
      expect(categories[0].id, equals(test${D}Model.id));
      expect(categories[0].${firstRow}, equals(test${D}Model.${firstRow}));
    });

    test('get${D}ById', () async {
      when(
        mock${D}LocalDataSource.get${D}ById(testId),
      ).thenAnswer((_) async => test${D}Model);

      final result = await ${d}RepositoryImpl.get${D}ById(testId);

      verify(mock${D}LocalDataSource.get${D}ById(testId)).called(1);

      expect(result.id, equals(test${D}Model.id));
      expect(result.${firstRow}, equals(test${D}Model.${firstRow}));
    });
    test('create${D}', () async {
      when(
        mock${D}LocalDataSource.create${D}(any),
      ).thenAnswer((_) async => testId);

      final result = await ${d}RepositoryImpl.create${D}(
        test${D}Entity,
      );

      verify(mock${D}LocalDataSource.create${D}(any)).called(1);
      expect(result, equals(testId));
    });

    test('update${D}', () async {
      when(
        mock${D}LocalDataSource.update${D}(any),
      ).thenAnswer((_) async => {});

      await ${d}RepositoryImpl.update${D}(test${D}Entity);

      verify(mock${D}LocalDataSource.update${D}(any)).called(1);
    });

    test('delete${D}', () async {
      when(
        mock${D}LocalDataSource.delete${D}(testId),
      ).thenAnswer((_) async => {});

      await ${d}RepositoryImpl.delete${D}(testId);

      verify(mock${D}LocalDataSource.delete${D}(testId)).called(1);
    });
  });
}


`;
  }
}

