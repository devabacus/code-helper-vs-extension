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



export const routerContent = `import 'package:flutter/material.dart';
    
    class AppRouter {
      static Route<dynamic>? generateRoute(RouteSettings settings) {
        switch (settings.name) {
          default:
            return MaterialPageRoute(
              builder: (_) => Scaffold(
                body: Center(child: Text('Страница не найдена')),
              ),
            );
        }
      }
    }`;


export const routesContent = `class AppRoutes {
        static const String home = '/';
      }`;

      