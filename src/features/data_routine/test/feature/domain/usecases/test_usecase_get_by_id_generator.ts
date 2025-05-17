import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../../feature/data/datasources/local/tables/drift_class_parser";


export class TestUseCaseGetByIdGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featureTestPath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featureTestPath), entityName, "crud", `${entityName}_get_by_id_usecase_test.dart`);
  }

  protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const projectPath = basePath.split('test');
    const projectName = path.basename(projectPath[0]);
    const fieldsRow = parser.fieldsForTest;
    const fieldsExpected = parser.fieldsExpectedForTest;
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/features/${featureName}/domain/entities/${d}/${d}.dart';
import 'package:${projectName}/features/${featureName}/domain/repositories/${d}_repository.dart';
import 'package:${projectName}/features/${featureName}/domain/usecases/${d}/get_by_id.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import '${d}_get_by_id_usecase_test.mocks.dart';

@GenerateMocks([I${D}Repository])
void main() {
  late Get${D}ByIdUseCase get${D}ByIdUseCase;
  late MockI${D}Repository mockI${D}Repository;
  const uuid = Uuid();

  setUp(() {
    mockI${D}Repository = MockI${D}Repository();
    get${D}ByIdUseCase = Get${D}ByIdUseCase(mockI${D}Repository);
  });

  test('should return correct item by id', () async {
    final testId = uuid.v7();
    final ${d} = ${D}Entity(id: testId, ${fieldsRow[0]});
    
    when(
      mockI${D}Repository.get${D}ById(testId),
    ).thenAnswer((_) async => ${d});

    final result = await get${D}ByIdUseCase(testId);

    verify(mockI${D}Repository.get${D}ById(testId)).called(1);
    expect(result, ${d});
    expect(result?.id, testId);
    expect(result?${fieldsExpected[0]});
  });

  test('shoul throw exception', () async {
    const wrongId = '999';
    
    when(
      mockI${D}Repository.get${D}ById(wrongId),
    ).thenThrow(StateError('${D} not found'));

    expect(
      () => get${D}ByIdUseCase(wrongId),
      throwsA(isA<StateError>()),
    );
    verify(mockI${D}Repository.get${D}ById(wrongId)).called(1);
  });
}
`;
  }
}
