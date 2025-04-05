import path from "path";
import { cap, pluralConvert, unCap } from "../../../../../utils/text_work/text_util";


export const useCaseGetAllPath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "usecases", unCap(driftClassName), "get_all.dart");

export const useCaseGetAllCont = (driftClassName: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);
  const Ds = pluralConvert(D);

  return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}/${d}.dart';

class Get${Ds}UseCase {
  final ${D}Repository _repository;

  Get${Ds}UseCase(this._repository);

  Future<List<${D}Entity>> call() {
    return _repository.get${Ds}();
  }
}
`;
};