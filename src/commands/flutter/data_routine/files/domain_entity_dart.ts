import path from "path";
import { DriftClassParser, Field } from "../drift_class_parser";



export const domainEntityPath = (fPath: string, driftClass: string) => path.join(fPath, "domain", "entities", `${driftClass}_entity.dart`);


export const domainEntityCont = (parser: DriftClassParser) => {
    const fieldsClass = parser.fieldsClass;
    const fieldsReqThis = parser.fieldsReqThis;
    const fieldsComma = parser.fiedsComma;

    
return `
import 'package:equatable/equatable.dart';

class CategoryEntity extends Equatable {
  ${fieldsClass}

  const CategoryEntity({
  ${fieldsReqThis}
  });

  @override
  List<Object?> get props => [${fieldsComma}];
}

`;};

