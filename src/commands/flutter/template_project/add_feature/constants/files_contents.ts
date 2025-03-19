import { capitalize } from "../../../../../utils/text_work/text_util";

// update while adding feature
export const importFeatureRoutesConst = (featureName: string) => `import '../../features/${featureName}/presentation/routing/${featureName}_routes_constants.dart';\n`;

export const addMethodToNavService = (featureName: string) => {
return `void navigateTo${capitalize(featureName)}(BuildContext context) {
    context.goNamed(${capitalize(featureName)}Routes.${featureName});
  }
`;};

export const featureNavService = (featureName: string) => {
  const capFeature = capitalize(featureName);

return`
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../routing/${featureName}_routes_constants.dart';


class ${capFeature}NavigationService {
  
  void navigateTo${capFeature}(BuildContext context){
      context.goNamed(${capFeature}Routes.${featureName});
  }

}

`;};


export const featureNavServiceProviderGen = (featureName: string) => {
  const capFeature = capitalize(featureName);

return`
// GENERATED CODE - DO NOT MODIFY BY HAND

part of '${featureName}_navigation_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$${featureName}NavigationServiceHash() =>
    r'f03c14873caf1ce8f4f324ef853a3117d17c2276';

/// See also [${featureName}NavigationService].
@ProviderFor(${featureName}NavigationService)
final ${featureName}NavigationServiceProvider =
    AutoDisposeProvider<${capFeature}NavigationService>.internal(
      ${featureName}NavigationService,
      name: r'${featureName}NavigationServiceProvider',
      debugGetCreateSourceHash:
          const bool.fromEnvironment('dart.vm.product')
              ? null
              : _$${featureName}NavigationServiceHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef ${capFeature}NavigationServiceRef =
    AutoDisposeProviderRef<${capFeature}NavigationService>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package

`;};

export const featureNavServiceProvider = (featureName: string) => {
  const capFeature = capitalize(featureName);

return `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/${featureName}_navigation_service.dart';

part '${featureName}_navigation_provider.g.dart';

@riverpod
${capFeature}NavigationService ${featureName}NavigationService(Ref ref) {
  return ${capFeature}NavigationService();
}


`;};

export const navServiceMethod = (featureName: string) => {
  const capFeature = capitalize(featureName);
return `
  void navigateTo${capFeature}(BuildContext context) {
    context.goNamed(${capFeature}Routes.${featureName});
  }
`;};


export const featureNavServiceMethod = (featureName: string, pageName: string) => {
  const capPage = capitalize(pageName);
  const capFeature = capitalize(featureName);
return `
  void navigateTo${capPage}(BuildContext context) {
    context.goNamed(${capFeature}Routes.${pageName});
  }
`;};

export const featurePageNameRouterMethod = (featureName: string, pageName: string) => {
  const capPage = capitalize(pageName);
  const capFeature = capitalize(featureName);
return `
  GoRoute(
    name: ${capFeature}Routes.${pageName},
    path: ${capFeature}Routes.${pageName}Path,
    builder: (BuildContext context, state) => ${capPage}Page(),
),
`;};


export const featurePageNameAddConstants = (featureName: string, pageName: string) => {
return `
    static const ${pageName} = '${featureName}_${pageName}';
    static const ${pageName}Path = '/${featureName}/${pageName}';
`;};


export const importPageFeatureRouter = (pageName: string) => `import '../../presentation/pages/${pageName}_page.dart';\n`;