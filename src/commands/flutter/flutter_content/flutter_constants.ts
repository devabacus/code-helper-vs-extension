export const BlePermissionsBlock = `
    <uses-feature android:name="android.hardware.bluetooth_le" android:required="false" />

    <!-- New Bluetooth permissions in Android 12 -->
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

    <!-- legacy for Android 11 or lower -->
    <uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30"/>

    <!-- legacy for Android 9 or lower -->
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="28" />
`;


export const folderOptions: Record<string, string[]> = {
    "Simple Feature": [
        'bloc',
        'models',
        'view',
        'widgets',
    ],
    "Flutter New Feature": [
        'data/datasources',
        'data/repositories',
        'domain/entries',
        'domain/repositories',
        'domain/usecases',
        'presentation/bloc',
        'presentation/pages',
        'presentation/widgets',
    ],
    "Presentation Only": [
        'presentation/bloc',
        'presentation/pages',
        'presentation/widgets',
    ]
};


export const barrelFiles: Record<string, string> = {
    "models": "models.dart",
    "view": "view.dart",
    "widgets": "widgets.dart",
    "data/datasources": "datasources.dart",
    "data/repositories": "repositories.dart",
    "domain/entries": "entries.dart",
    "domain/repositories": "repositories.dart",
    "domain/usecases": "usecases.dart",
    "presentation/pages": "pages.dart",
    "presentation/widgets": "widgets.dart"
};



export const routerContent = 
`
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:talker_flutter/talker_flutter.dart';
import 'package:mlogger/mlogger.dart';

import './routes_constants.dart';

part 'router_config.g.dart';
 

@riverpod
GoRouter appRouter(Ref ref) {
  return GoRouter(
    observers: [TalkerRouteObserver(log.talker)],
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
