import { capitalize } from "../../../../utils/text_work/text_util";


export const importFeatureRouter = (featureName: string) => `import '../../features/${featureName}/presentation/routing/${featureName}_router_config.dart';\n`;


export const routerContent = (featureName: string) =>
  `
// ignore_for_file: unused_import
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:mlogger/mlogger.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:talker_flutter/talker_flutter.dart';
import './routes_constants.dart';

part 'router_config.g.dart';
 
@riverpod
GoRouter appRouter(Ref ref) {
  return GoRouter(
    // observers: [TalkerRouteObserver(log.talker)],
    initialLocation: AppRoutes.homePath,
    routes: [
        
    ]); 
}   

`;


export const routesContent =
  `
abstract class AppRoutes {
  static const home = 'home';
  static const homePath = '/';

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


export const routerFeatureFileContent = (featureName: string) =>
  `
import 'dart:core';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '${featureName}_routes_constants.dart';
import '../../presentation/pages/${featureName}_page.dart';

List<RouteBase> get${capitalize(featureName)}Routes() {
  return [
    GoRoute(
      name: ${capitalize(featureName)}Routes.${featureName},
      path: ${capitalize(featureName)}Routes.${featureName}Path,
      builder: (BuildContext context, state) => ${capitalize(featureName)}Page(),
    ),
  ];
}
`;


export const featureRoutesConstants = (featureName: string) => `
abstract class ${capitalize(featureName)}Routes {
    static const ${featureName} = '${featureName}';
    static const ${featureName}Path = '/${featureName}';

    static const detail = '${featureName}_detail';
    static const detailPath = '/${featureName}/detail';  
}
`;









