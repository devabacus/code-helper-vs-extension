import { cap } from "@utils";
import { PathData } from "@flutter_utils";

export const fRoutesConstPth = (fPath: string, fName: string) => `${fPath}/presentation/routing/${fName}_routes_constants.dart`;


export const fRoutesConsts = (fName: string) => `
abstract class ${cap(fName)}Routes {
    static const ${fName} = '${fName}';
    static const ${fName}Path = '/${fName}';
}
`;

export const fAddConst = (p: PathData, pms: string = '') => {

  return `
    static const ${p.unCapPageName} = '${p.featureName}_${p.pageName}';
    static const ${p.unCapPageName}Path = '/${p.featureName}/${p.pageName}${pms}';
  `;
};

