import { cap } from "@utils";

export const imFRoutesConst = (featureName: string) => `import '../../features/${featureName}/presentation/routing/${featureName}_routes_constants.dart';\n`;

export const imFRouter = (fName: string) => `import '../../features/${fName}/presentation/routing/${fName}_router_config.dart';\n`;




export const appRouterAdd = (featureName: string) =>
    `\t\t\t...get${cap(featureName!)}Routes(),`;

export const routerCont =
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