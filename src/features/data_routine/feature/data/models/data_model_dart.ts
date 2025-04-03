import path from "path";
import { cap } from "../../../../../utils/text_work/text_util";



export const dataModelPath = (fPath: string, driftClassName: string) => path.join(fPath, "data", "models", `${driftClassName}_model.dart`);




export const dataModelCont = (driftClassName: string, fields: string) => {
  const d = driftClassName;
  const D = cap(driftClassName);

  return `
import 'package:freezed_annotation/freezed_annotation.dart';

part '${d}_model.freezed.dart';
part '${d}_model.g.dart';

@freezed
abstract class ${D}Model with _$${D}Model {
  const factory ${D}Model({
    ${fields}
  }) = _${D}Model;

  factory ${D}Model.fromJson(Map<String, dynamic> json) => _$${D}ModelFromJson(json);
}
`;
};



