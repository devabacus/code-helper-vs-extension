import { capitalize } from "../../../../utils/text_work/text_util";

export const addMethodToNavService = (featureName: string) => {
    return `void navigateTo${capitalize(featureName)}(BuildContext context) {
    context.goNamed(${capitalize(featureName)}Routes.${featureName});
  }
`;
};


export const navServiceMethod = (featureName: string) => {
    const capFeature = capitalize(featureName);
    return `
    void navigateTo${capFeature}(BuildContext context) {
      context.goNamed(${capFeature}Routes.${featureName});
    }
  `;
};
