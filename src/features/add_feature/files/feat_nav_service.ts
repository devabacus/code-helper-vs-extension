import { cap } from "@utils";
import { ClsParams } from "@flutter_utils";

export const fNavServPath = (fPath: string, fName: string) => `${fPath}/presentation/services/${fName}_navigation_service.dart`;


export const fNavServBase = (fName: string) => {
  const capFeature = cap(fName);

  return `
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../routing/${fName}_routes_constants.dart';


class ${capFeature}NavigationService {
  
  void navigateTo${capFeature}(BuildContext context){
      context.goNamed(${capFeature}Routes.${fName});
  }

}

`;
};

function pmForNavMethod(fields: ClsParams[]): string {
  let mlist = [];
  if (fields.length > 0) {

    for (const field of fields) {
      // if (field.isNullable) {
      mlist.push(`'${field.name}': ${field.name}`);
      // }
    }
    const paramsStr = mlist.join(', ');
    return `, pathParameters: {${paramsStr}}`;
  }
  return '';
}

export const paramHandle = (params: ClsParams[]): string => {
  if (params.length > 0) {
    const paramList = params.map((param) => `, ${param.type.split('?')[0]} ${param.name}`);
    return paramList.join('');
  }
  return '';
};

export const fNavServ = (fName: string, pName: string, fields: ClsParams[]) => {

  const capP = cap(pName);
  const capF = cap(fName);
  return `
    void navigateTo${capP}(BuildContext context${paramHandle(fields)}) {
      context.goNamed(${capF}Routes.${pName}${pmForNavMethod(fields)});
    }
  `;
};
