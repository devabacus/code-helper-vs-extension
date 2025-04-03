import path from "path";
import { cap, unCap } from "@utils";


export const useCaseDeletePath = (fPath: string, driftClassName: string) => path.join(fPath, "domain", "usecases", unCap(driftClassName), "delete.dart");

export const useCaseDeleteCont = (driftClassName: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);

  return `
import '../../repositories/${d}_repository.dart';

class Delete${D}UseCase {
  final ${D}Repository _repository;

  Delete${D}UseCase(this._repository);

  Future<void> call(int id) async {
    return _repository.delete${D}(id);
  }
}
`;
};