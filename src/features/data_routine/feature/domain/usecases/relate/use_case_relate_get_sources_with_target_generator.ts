import path from "path";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../../generators/relate_data_routine_generator";
import { pluralConvert } from "../../../../../../utils/text_work/text_util";

export class UseCaseRelateGetSourcesWithTargetGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem, structure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // Использует this.useCaseSubDirSnake, this.sourcePluralSnake, this.targetSnake из базового класса
    const fileName = `get_${this.sourcePluralSnake}_with_${this.targetSnake}.dart`;
    return path.join(this.projectStructure.getDomainUseCasesPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    const sourceUpperPlural = pluralConvert(this.sourceUpper);

    return `
import '../../entities/${this.sourceSnake}/${this.sourceSnake}.dart';
import '../../repositories/${this.intermediateSnake}_repository.dart';

class Get${sourceUpperPlural}With${this.targetUpper}UseCase {
  final I${this.intermediateUpper}Repository repository;

  const Get${sourceUpperPlural}With${this.targetUpper}UseCase(this.repository);

  Future<List<${this.sourceUpper}Entity>> call(String ${this.targetForeignKey}) {
    return repository.get${this.sourcePlural}With${this.targetUpper}(${this.targetForeignKey});
  }
}
`;
  }
}
