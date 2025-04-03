import { cap } from "@utils";


export const navServ = `
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavigationService {
}
`;


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
