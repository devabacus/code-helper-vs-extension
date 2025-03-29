import path from "path";
import { DriftClassParser, Field } from "../drift_class_parser";



export const domainEntityPath = (fPath: string, driftClass: string) => path.join(fPath, "domain", "entities", `${driftClass}.dart`);


export const domainEntityCont = (parser: DriftClassParser) => {
    const fieldsClass = parser.fieldsClass;
    const fieldsReqThis = parser.fieldsReqThis;
    const fieldsComma = parser.fiedsComma;
    const D = parser.driftClassName;
    

    
return `
import 'package:equatable/equatable.dart';          

class ${D}Entity extends Equatable {
  ${fieldsClass}

  const ${D}Entity({
  ${fieldsReqThis}
  });

  @override
  List<Object?> get props => [${fieldsComma}];
}

`;};

