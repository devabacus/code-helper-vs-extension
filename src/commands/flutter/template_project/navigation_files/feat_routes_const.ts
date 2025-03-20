import { cap } from "../../../../utils/text_work/text_util";

export const fRoutesConstPath = (fPath: string, fName: string) => `${fPath}/presentation/routing/${fName}_routes_constants.dart`;


export const fRoutesConsts = (fName: string) => `
abstract class ${cap(fName)}Routes {
    static const ${fName} = '${fName}';
    static const ${fName}Path = '/${fName}';
}
`;

export const fAddConst = (fName: string, pName: string, pms: string = '') => {

  return `
    static const ${pName} = '${fName}_${pName}';
    static const ${pName}Path = '/${fName}/${pName}${pms}';
  `;
};

