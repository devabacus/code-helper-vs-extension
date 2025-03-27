import { cap } from "../../../../utils/text_work/text_util";

export const fRouterPath = (fPath: string, fName: string) => `${fPath}/presentation/routing/${fName}_router_config.dart`;

export const imPageFRouter = (pName: string) => `import '../../presentation/pages/${pName}_page.dart';\n`;


export const routerFFlCont = (featureName: string) => {
  const capitalizeName = cap(featureName);

  return `
import '../../presentation/pages/${featureName}_page.dart';
import '${featureName}_routes_constants.dart';

import 'dart:core';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';


List<RouteBase> get${capitalizeName}Routes() {
  return [
    GoRoute(
      name: ${capitalizeName}Routes.${featureName},
      path: ${capitalizeName}Routes.${featureName}Path,
      builder: (BuildContext context, state) => ${capitalizeName}Page(),
    ),
  ];
}
`;
};



export function pmRowsCreater(pms: string[]): string {
  const rows = pms.map((pm) => `final ${pm} = state.pathParameters['${pm}'];`);
  return rows.join('\n');
}

export function constrpm(pms: string[], pName: string): string {
  const capPage = cap(pName);
  const pmsMod = pms.map((pm) => `${pm}: ${pm}`);
  const pmsStr = pmsMod.join(', ');
  return `return ${capPage}Page(${pmsStr});`;
}

const getBody = (pms: string[], unCapPageName: string): string => {
    return `
      ${pmRowsCreater(pms)}
      ${constrpm(pms, unCapPageName)}
    `;
};

export const fRouterPm = (fName: string, unCapPageName: string, pms: string[]) => {
  const capF = cap(fName);
  return `
    GoRoute(
      name: ${capF}Routes.${unCapPageName},
      path: ${capF}Routes.${unCapPageName}Path,
      builder: (BuildContext context, state) {
        ${getBody(pms, unCapPageName)}
      }
  ),
  `;
};

