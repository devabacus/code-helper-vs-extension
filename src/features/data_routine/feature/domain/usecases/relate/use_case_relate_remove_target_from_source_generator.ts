import path from "path";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../../generators/relate_data_routine_generator";

export class UseCaseRelateRemoveTargetFromSourceGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem, structure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // Использует this.useCaseSubDirSnake, this.targetSnake, this.sourceSnake из базового класса
    const fileName = `remove_${this.targetSnake}_from_${this.sourceSnake}.dart`;
    return path.join(this.projectStructure.getDomainUseCasesPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // Использует this.intermediateSnake, this.targetUpper, this.sourceUpper,
    // this.sourceForeignKey, this.targetForeignKey из базового класса
    return `
import '../../repositories/${this.intermediateSnake}_repository.dart';

class Remove${this.targetUpper}From${this.sourceUpper}UseCase {
  final I${this.intermediateUpper}Repository repository;

  Remove${this.targetUpper}From${this.sourceUpper}UseCase(this.repository);

  Future<void> call(String ${this.sourceForeignKey}, String ${this.targetForeignKey}) {
    return repository.remove${this.targetUpper}From${this.sourceUpper}(${this.sourceForeignKey}, ${this.targetForeignKey});
  }
}
`;
  }
}
