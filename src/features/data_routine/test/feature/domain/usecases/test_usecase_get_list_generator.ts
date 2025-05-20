import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../../feature/data/datasources/local/tables/drift_class_parser";
import { pluralConvert } from "../../../../../../utils/text_work/text_util";


export class TestUseCaseGetListGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featureTestPath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featureTestPath), entityName, "crud", `${entityName}_get_list_usecase_test.dart`);
  }

  protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const projectPath = basePath.split('test');
    const projectName = path.basename(projectPath[0]).replace(`_flutter`, '');
    const fieldsRow = parser.fieldsForTest;
    const Ds = pluralConvert(D);
    const ds = pluralConvert(d);
    const fieldsExpected = parser.fieldsExpectedForTest;
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/features/${featureName}/domain/entities/${d}/${d}.dart';
import 'package:${projectName}/features/${featureName}/domain/repositories/${d}_repository.dart';
import 'package:${projectName}/features/${featureName}/domain/usecases/${d}/get_all.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import '${d}_get_list_usecase_test.mocks.dart';

@GenerateMocks([I${D}Repository])
void main() {
  late Get${Ds}UseCase get${Ds}UseCase;
  late MockI${D}Repository mockI${D}Repository;
  const uuid = Uuid();

  setUp(() {
    mockI${D}Repository = MockI${D}Repository();
    get${Ds}UseCase = Get${Ds}UseCase(mockI${D}Repository);
  });

  test('should return list of items from repository', () async {
    final testId1 = uuid.v7();
    final testId2 = uuid.v7();

    final ${ds} = [
      ${D}Entity(id: testId1, ${fieldsRow[0]}),
      ${D}Entity(id: testId2, ${fieldsRow[1]}),
    ];
    
    when(
      mockI${D}Repository.get${Ds}(),
    ).thenAnswer((_) async => ${ds});

    final result = await get${Ds}UseCase();

    verify(mockI${D}Repository.get${Ds}()).called(1);
    expect(result, ${ds});
    expect(result.length, 2);
  });
}
`;
  }
}
