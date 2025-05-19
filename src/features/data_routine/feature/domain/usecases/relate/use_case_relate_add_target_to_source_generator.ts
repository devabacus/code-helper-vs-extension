import path from "path";
import { IFileSystem } from "../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../core/interfaces/project_structure";
import { DriftClassParser } from "../../../data/datasources/local/tables/drift_class_parser";
import { RelateDataRoutineGenerator } from "../../../../generators/relate_data_routine_generator";

export class UseCaseRelateAddGenerator extends RelateDataRoutineGenerator {

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem, structure);
  }

  protected getRelatePath(featurePath: string, _entityName: string, _parser: DriftClassParser): string {
    // Properties like this.useCaseSubDirSnake, this.targetSnake, this.sourceSnake
    // are initialized by the base RelateDataRoutineGenerator
    const fileName = `add_${this.targetSnake}_to_${this.sourceSnake}.dart`;
    return path.join(this.projectStructure.getDomainUseCasesPath(featurePath), this.useCaseSubDirSnake, fileName);
  }

  protected getRelateContent(_parser: DriftClassParser): string {
    // Properties like this.intermediateSnake, this.targetUpper, this.sourceUpper,
    // this.sourceForeignKey, this.targetForeignKey are available from the base class.
    return `
import '../../repositories/${this.intermediateSnake}_repository.dart';

class Add${this.targetUpper}To${this.sourceUpper}UseCase {
  final I${this.intermediateUpper}Repository repository;

  const Add${this.targetUpper}To${this.sourceUpper}UseCase(this.repository);

  Future<void> call(String ${this.sourceForeignKey}, String ${this.targetForeignKey}) {
    return repository.add${this.targetUpper}To${this.sourceUpper}(${this.sourceForeignKey}, ${this.targetForeignKey});
  }
}
`;
  }
}
