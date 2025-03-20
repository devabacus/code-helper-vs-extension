
export const fRoutesConstPath = (fPath: string, fName: string) => `${fPath}/presentation/routing/${fName}_routes_constants.dart`;


export const fAddConst = (fName: string, pName: string, pms: string = '') => {

  return `
    static const ${pName} = '${fName}_${pName}';
    static const ${pName}Path = '/${fName}/${pName}${pms}';
  `;
};

