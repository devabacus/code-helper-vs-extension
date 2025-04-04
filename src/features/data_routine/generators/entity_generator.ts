// src/features/data_routine/generators/entity_generator.ts
import { BaseGenerator } from "./base_generator";
import * as path from "path";
import { DriftClassParser } from "../feature/data/datasources/local/tables/drift_class_parser";

export class EntityGenerator extends BaseGenerator {

    protected getPath(featurePath: string, entityName: string): string {
        return path.join(featurePath, "domain", "entities", `${entityName}.dart`);
    }
    protected getContent(parser: DriftClassParser): string {
        const fieldsClass = parser.fieldsClass;
        const fieldsReqThis = parser.fieldsReqThis;
        const fieldsComma = parser.fieldsComma;
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

`;
    };
}

