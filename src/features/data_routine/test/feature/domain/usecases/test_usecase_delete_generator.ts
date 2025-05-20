import path from "path";
import { BaseGenerator } from "../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../../feature/data/datasources/local/tables/drift_class_parser";


export class TestUseCaseDeleteGenerator extends BaseGenerator {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure();
  }

  protected getPath(featureTestPath: string, entityName: string): string {
    return path.join(this.structure.getDomainUseCasesPath(featureTestPath), entityName, "crud", `${entityName}_delete_usecase_test.dart`);
  }

  protected getContent(parser: DriftClassParser, name: '', basePath: string): string {
    const d = parser.driftClassNameLower;
    const D = parser.driftClassNameUpper;
    const projectPath = basePath.split('test');
    const projectName = path.basename(projectPath[0]).replace(`_flutter`, '');
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/features/${featureName}/domain/repositories/${d}_repository.dart';
import 'package:${projectName}/features/${featureName}/domain/usecases/${d}/delete.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:uuid/uuid.dart';

import '${d}_delete_usecase_test.mocks.dart';

@GenerateMocks([I${D}Repository])
void main() {
  late Delete${D}UseCase delete${D}UseCase;
  late MockI${D}Repository mockI${D}Repository;
  const uuid = Uuid();

  setUp(() {
    mockI${D}Repository = MockI${D}Repository();
    delete${D}UseCase = Delete${D}UseCase(mockI${D}Repository);
  });

  test('should call delete with correct id', () async {
    final testId = uuid.v7();
    
    when(
      mockI${D}Repository.delete${D}(testId),
    ).thenAnswer((_) async => {});

    await delete${D}UseCase(testId);

    verify(mockI${D}Repository.delete${D}(testId)).called(1);
  });
}

`;
  }
}
