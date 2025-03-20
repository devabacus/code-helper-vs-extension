import { cap } from "../../../../utils/text_work/text_util";
import { ClsParams } from "../../utils/text_utils";

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



function pmForNavMethod(pms: string[]): string {
  if (pms.length > 0) {
    const paramsMod = pms.map((param) => `'${param}': ${param}`);
    const paramsStr = paramsMod.join(', ');



    
    return `, pathParameters: {${paramsStr}}`;
  }
  return '';
}

export const paramHandle = (params: ClsParams[]): string => {
  if (params.length > 0) {
    const paramList = params.map((param) => `, ${param.type} ${param.name}`);
  return paramList.join('');
  }
  return '';
};

// const types = fields.map((field) => field.type);



export const fNavServ = (fName: string, pName: string, fields: ClsParams[]) => {
  const names = fields.map((field) => field.name);

  const capP = cap(pName);
  const capF = cap(fName);
  return `
    void navigateTo${capP}(BuildContext context${paramHandle(fields)}) {
      context.goNamed(${capF}Routes.${pName}${pmForNavMethod(names)});
    }
  `;
};
