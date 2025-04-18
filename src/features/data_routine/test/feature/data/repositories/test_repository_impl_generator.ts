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
    const projectName = path.basename(projectPath[0]);
    const featureName = (projectPath[1]).split(path.sep)[2];
    return `import 'package:${projectName}/features/${featureName}/data/datasources/local/interfaces/${d}_local_datasource_service.dart';
import 'package:${projectName}/features/${featureName}/data/models/${d}/${d}_model.dart';
import 'package:${projectName}/features/${featureName}/data/repositories/${d}_repository_impl.dart';
import 'package:${projectName}/features/${featureName}/domain/entities/${d}/${d}.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import '${d}_repository_impl_test.mocks.dart';


@GenerateMocks([I${D}LocalDataSource])
void main() {

    late MockI${D}LocalDataSource mock${D}LocalDataSource;
    late ${D}RepositoryImpl ${d}RepositoryImpl;


    setUp((){
      mock${D}LocalDataSource = MockI${D}LocalDataSource();
      ${d}RepositoryImpl = ${D}RepositoryImpl(mock${D}LocalDataSource);
    });

    group('${d}RepositoryImpl',(){

      final test${D}Model = ${D}Model(id: 1, title: 'Test ${D}');
      final test${D}ModelList = [${D}Model(id: 1, title: 'Test ${D}')];
      final test${D}Entity = ${D}Entity(id: -1, title: 'Test ${D}');
      
      test('get${Ds}', () async{
          when(mock${D}LocalDataSource.get${Ds}()).thenAnswer((_)async=>test${D}ModelList);

          final categories = await ${d}RepositoryImpl.get${Ds}();

          verify(mock${D}LocalDataSource.get${Ds}()).called(1);
          expect(categories.length, 1);
          expect(categories[0].id, equals(test${D}Model.id));
          expect(categories[0].title, equals(test${D}Model.title));
      });


      test('get${D}ById', () async {
        when(mock${D}LocalDataSource.get${D}ById(1)).thenAnswer((_)async=>test${D}Model);

        final result = await ${d}RepositoryImpl.get${D}ById(1);

        verify(mock${D}LocalDataSource.get${D}ById(1)).called(1);
        
        expect(result.id, equals(test${D}Model.id));
        expect(result.title, equals(test${D}Model.title));
        
      });
            test('create${D}', () async {
        final expectedId = 1;

        when(mock${D}LocalDataSource.create${D}(any))
            .thenAnswer((_) async => expectedId);

        final result = await ${d}RepositoryImpl.create${D}(test${D}Entity);

        verify(mock${D}LocalDataSource.create${D}(any)).called(1);
        expect(result, equals(expectedId));
      });

      test('update${D}', () async {
        when(mock${D}LocalDataSource.update${D}(any))
            .thenAnswer((_) async => {});

        await ${d}RepositoryImpl.update${D}(test${D}Entity);

        verify(mock${D}LocalDataSource.update${D}(any)).called(1);
      });

      test('delete${D}', () async {
        
        final ${d}Id = 1;

        when(mock${D}LocalDataSource.delete${D}(${d}Id))
            .thenAnswer((_) async => {});

        await ${d}RepositoryImpl.delete${D}(${d}Id);

        verify(mock${D}LocalDataSource.delete${D}(${d}Id)).called(1);
      });

    });

}

`;
  }
}
