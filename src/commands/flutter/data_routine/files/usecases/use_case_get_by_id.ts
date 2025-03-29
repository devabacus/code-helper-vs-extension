import path from "path";
import { cap, unCap } from "../../../../../utils/text_work/text_util";


export const useCaseGetByIdPath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "usecases", unCap(driftClassName), "get_by_id.dart");

export const useCaseGetByIdCont = (driftClassName: string) => {
    const d = driftClassName;
    const D = cap(driftClassName);

    return `
import '../../repositories/${d}_repository.dart';
import '../../entities/${d}.dart';

class Get${D}ByIdUseCase {
  final ${D}Repository _repository;

  Get${D}ByIdUseCase(this._repository);

  Future<${D}Entity?> call(int id) {
    return _repository.get${D}ById(id);
  }
}
`;
};