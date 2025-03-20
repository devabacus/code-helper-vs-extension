import { cap } from "../../../../utils/text_work/text_util";

export const addMethodToNavService = (featureName: string) => {
    return `void navigateTo${cap(featureName)}(BuildContext context) {
    context.goNamed(${cap(featureName)}Routes.${featureName});
  }
`;
};


export const navServiceMethod = (featureName: string) => {
    const capFeature = cap(featureName);
    return `
    void navigateTo${capFeature}(BuildContext context) {
      context.goNamed(${capFeature}Routes.${featureName});
    }
  `;
};
