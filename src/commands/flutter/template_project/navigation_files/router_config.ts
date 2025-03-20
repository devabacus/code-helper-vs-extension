import { capitalize } from "../../../../utils/text_work/text_util";

export const imFRoutesConst = (featureName: string) => `import '../../features/${featureName}/presentation/routing/${featureName}_routes_constants.dart';\n`;


export const appRouterAdd = (featureName: string) =>
    `\t\t\t...get${capitalize(featureName!)}Routes(),`;
