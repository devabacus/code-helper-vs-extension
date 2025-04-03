import path from "path";
import { cap, unCap } from "../../../../../utils/text_work/text_util";


export const useCaseUpdatePath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "usecases", unCap(driftClassName), "update.dart");

export const useCaseUpdateCont = (driftClassName: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);

  return `
import '../../entities/${d}.dart';
import '../../repositories/${d}_repository.dart';

class Update${D}UseCase {
  final ${D}Repository _repository;

  Update${D}UseCase(this._repository);

  Future<void> call(${D}Entity ${d}) async {
    return _repository.update${D}(${d});
  }
}
`;
};