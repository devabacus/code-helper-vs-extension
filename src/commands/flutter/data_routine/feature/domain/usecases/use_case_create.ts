import path from "path";
import { cap, unCap } from "../../../../../../utils/text_work/text_util";


export const useCaseCreatePath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "usecases", unCap(driftClassName), "create.dart");

export const useCaseCreateCont = (driftClassName: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);

  return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}.dart';

class Create${D}UseCase {
  final ${D}Repository _repository;
  
  Create${D}UseCase(this._repository);
  
  Future<int> call(${D}Entity ${d}) {
    return _repository.create${D}(${d});
  }
}
`;
};