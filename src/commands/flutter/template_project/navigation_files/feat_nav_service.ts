import { cap } from "../../../../utils/text_work/text_util";

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



export function pmForNavMethod(pms: string[]): string {
  if (pms.length > 0) {
    const paramsMod = pms.map((param) => `'${param}': ${param}`);
    const paramsStr = paramsMod.join(', ');
    return `, pathParameters: {${paramsStr}}`;
  }
  return '';

}



export const fNavServ = (fName: string, pName: string, pms: string[]) => {

  const capP = cap(pName);
  const capF = cap(fName);
  return `
    void navigateTo${capP}(BuildContext context) {
      context.goNamed(${capF}Routes.${pName}${pmForNavMethod(pms)});
    }
  `;
};
