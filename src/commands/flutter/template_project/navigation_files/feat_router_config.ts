import { capitalize } from "../../../../utils/text_work/text_util";

export const fRouterPath = (fPath: string, fName: string) => `${fPath}/presentation/routing/${fName}_router_config.dart`;

export const imPageFRouter = (pName: string) => `import '../../presentation/pages/${pName}_page.dart';\n`;


// export const featureRouter = (fName: string, pName: string) => {
//   const capPage = capitalize(pName);
//   const capF = capitalize(fName);
//   return `
//     GoRoute(
//       name: ${capF}Routes.${pName},
//       path: ${capF}Routes.${pName}Path,
//       builder: (BuildContext context, state) => ${capPage}Page(),
//   ),
//   `;
// };

export function pmRowsCreater(pms: string[]): string {
  const rows = pms.map((pm) => `final ${pm} = state.pathParameters['${pm}'];`);
  return rows.join('\n');
}

export function constrpm(pms: string[], pName: string): string {
  const capPage = capitalize(pName);
  const pmsMod = pms.map((pm) => `${pm}: ${pm}`);
  const pmsStr = pmsMod.join(', ');
  return `return ${capPage}Page(${pmsStr});`;
}

const getBody = (pms: string[], pName: string): string => {
  if (pms.length > 0) {
    return `
      ${pmRowsCreater(pms)}
      ${constrpm(pms, pName)}
    `;
  } else {
    return '';
  }
};

export const fRouterPm = (fName: string, pName: string, pms: string[]) => {
  const capF = capitalize(fName);
  return `
    GoRoute(
      name: ${capF}Routes.${pName},
      path: ${capF}Routes.${pName}Path,
      builder: (BuildContext context, state) {
        ${getBody(pms,pName)}
      }
  ),
  `;
};

