import path from "path";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../../generators/relate_data_routine_generator";

export class UseCaseRelateRemoveAllTargetsFromSourceGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem, structure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // Использует this.useCaseSubDirSnake, this.targetPluralSnake, this.sourceSnake из базового класса
    const fileName = `remove_all_${this.targetPluralSnake}_from_${this.sourceSnake}.dart`;
    return path.join(this.projectStructure.getDomainUseCasesPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // Использует this.intermediateSnake, this.targetUpper, this.sourceUpper,
    // this.targetPlural, this.sourceForeignKey из базового класса
    return `
import '../../repositories/${this.intermediateSnake}_repository.dart';

class RemoveAll${this.targetPlural}From${this.sourceUpper}UseCase {
  final I${this.intermediateUpper}Repository repository;

  RemoveAll${this.targetPlural}From${this.sourceUpper}UseCase(this.repository);

  Future<void> call(String ${this.sourceForeignKey}) {
    return repository.removeAll${this.targetPlural}From${this.sourceUpper}(${this.sourceForeignKey});
  }
}
`;
  }
}
