import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../../feature/data/datasources/local/tables/drift_class_parser";
import { pluralConvert } from "../../../../../../utils/text_work/text_util";


export class TestUseCaseWatchGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featureTestPath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featureTestPath), entityName, "crud", `${entityName}_watch_usecase_test.dart`);
  }

  protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const Ds = pluralConvert(D);
    const projectPath = basePath.split('test');
    const projectName = path.basename(projectPath[0]).replace(`_flutter`, '');
    const fieldsRow = parser.fieldsForTest;
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'dart:async';
import 'package:${projectName}/features/${featureName}/domain/entities/${d}/${d}.dart';
import 'package:${projectName}/features/${featureName}/domain/repositories/${d}_repository.dart';
import 'package:${projectName}/features/${featureName}/domain/usecases/${d}/watch_all.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import '${d}_watch_usecase_test.mocks.dart';

@GenerateMocks([I${D}Repository])
void main() {
  late Watch${Ds}UseCase watch${Ds}UseCase;
  late MockI${D}Repository mockI${D}Repository;
  const uuid = Uuid();

  setUp(() {
    mockI${D}Repository = MockI${D}Repository();
    watch${Ds}UseCase = Watch${Ds}UseCase(mockI${D}Repository);
  });

  group('watch categories test', () {
    test('should return stream of ${d} list from repository', () {
      final testId1 = uuid.v7();
      final testId2 = uuid.v7();

      final categoriesList = [
        ${D}Entity(id: testId1, ${fieldsRow[0]}),
        ${D}Entity(id: testId2, ${fieldsRow[1]}),
      ];

      final controller = StreamController<List<${D}Entity>>();

      when(
        mockI${D}Repository.watch${Ds}(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watch${Ds}UseCase();
      verify(mockI${D}Repository.watch${Ds}()).called(1);
      expectLater(resultStream, emits(categoriesList));
      controller.add(categoriesList);
      addTearDown(() {
        controller.close();
      });
    });

    test('should handle an empty stream from repository', () {
      final controller = StreamController<List<${D}Entity>>();
      when(
        mockI${D}Repository.watch${Ds}(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watch${Ds}UseCase();
      verify(mockI${D}Repository.watch${Ds}()).called(1);
      expectLater(resultStream, emitsDone);
      controller.close();
    });

    test('should handle stream errors from repository', () {
      final controller = StreamController<List<${D}Entity>>();
      final exception = Exception('Database error');
      when(
        mockI${D}Repository.watch${Ds}(),
      ).thenAnswer((_) => controller.stream);

      final resultStream = watch${Ds}UseCase();
      verify(mockI${D}Repository.watch${Ds}()).called(1);
      expectLater(resultStream, emitsError(isA<Exception>()));
      controller.addError(exception);
      addTearDown(() {
        controller.close();
      });
    });
  });
}
`;
  }
}
