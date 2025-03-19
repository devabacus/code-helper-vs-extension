import { capitalize } from "../../../../../utils/text_work/text_util";


export const importFeatureRouter = (featureName: string) => `import '../../features/${featureName}/presentation/routing/${featureName}_router_config.dart';\n`;

export const routerContent =
  `
// ignore_for_file: unused_import
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mlogger/mlogger.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:talker_flutter/talker_flutter.dart';
import './routes_constants.dart';
import '../../features/home/presentation/routing/home_routes_constants.dart';

part 'router_config.g.dart';
 
@riverpod
GoRouter appRouter(Ref ref) {
  return GoRouter(
    // observers: [TalkerRouteObserver(log.talker)],
    initialLocation: HomeRoutes.homePath,
    routes: [
        
    ]); 
}   

`;

export const routesContent =
  `
abstract class AppRoutes {
  
}
`;

export const routerConfigGenerator =
  `
// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'router_config.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$appRouterHash() => r'436f53c59eea24b0c7ff870ad3c6a206ce952ce9';

/// See also [appRouter].
@ProviderFor(appRouter)
final appRouterProvider = AutoDisposeProvider<GoRouter>.internal(
  appRouter,
  name: r'appRouterProvider',
  debugGetCreateSourceHash:
      const bool.fromEnvironment('dart.vm.product') ? null : _$appRouterHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AppRouterRef = AutoDisposeProviderRef<GoRouter>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
  
`;

export const routerFeatureFileContent = (featureName: string) => {
  const capitalizeName = capitalize(featureName);
  
  return `
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '${featureName}_routes_constants.dart';
import '../../presentation/pages/${featureName}_page.dart';

List<RouteBase> get${capitalizeName}Routes() {
  return [
    GoRoute(
      name: ${capitalizeName}Routes.${featureName},
      path: ${capitalizeName}Routes.${featureName}Path,
      builder: (BuildContext context, state) => ${capitalizeName}Page(),
    ),
  ];
}
`;};

export const featureRoutesConstants = (featureName: string) => `
abstract class ${capitalize(featureName)}Routes {
    static const ${featureName} = '${featureName}';
    static const ${featureName}Path = '/${featureName}';

    static const detail = '${featureName}_detail';
    static const detailPath = '/${featureName}/detail';  
}
`;

// navigation service
export const navigationService = `
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NavigationService {

}

`;




export const navigationServiceProviderDart = `
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../services/navigation_service.dart';

part 'navigation_provider.g.dart';


@riverpod
NavigationService navigationService(Ref ref) {
  return NavigationService();
}
`;

export const navigationServiceProviderGenDart = `
// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'navigation_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$navigationServiceHash() => r'7aa3a928ff02a6149ab847e3fe985a33abd8b01d';

/// See also [navigationService].
@ProviderFor(navigationService)
final navigationServiceProvider =
    AutoDisposeProvider<NavigationService>.internal(
      navigationService,
      name: r'navigationServiceProvider',
      debugGetCreateSourceHash:
          const bool.fromEnvironment('dart.vm.product')
              ? null
              : _$navigationServiceHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef NavigationServiceRef = AutoDisposeProviderRef<NavigationService>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package

`;

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


export const featureNavServicePath = (featurePath: string, featureName: string) => `${featurePath}/presentation/services/${featureName}_navigation_service.dart`;

export const featureNavServiceProviderPath = (featurePath: string, featureName: string) => `${featurePath}/presentation/providers/${featureName}_navigation_provider.dart`;

export const featureNavServiceProviderGenPath = (featurePath: string, featureName: string) => `${featurePath}/presentation/providers/${featureName}_navigation_provider.g.dart`;


export const navServiceMethod = (featureName: string) => {
  const capFeature = capitalize(featureName);
return `
  void navigateTo${capFeature}(BuildContext context) {
    context.goNamed(${capFeature}Routes.${featureName});
  }
`;};


