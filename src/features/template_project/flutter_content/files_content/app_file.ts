// export const appFile = `
// import 'package:flutter/material.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../core/routing/router_config.dart';


// class App extends ConsumerWidget {
//   const App({super.key});

//   @override
//   Widget build(BuildContext context, WidgetRef ref) {
//     final router = ref.read(appRouterProvider);
//     return MaterialApp.router(routerConfig: router);
//   }
// }
// `;


export const appFile = `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'auth_wrapper.dart';
import 'core/sync/sync_controller_provider.dart';
import 'check/server_check_ui.dart';


class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Инициализируем контроллер синхронизац    ии
    ref.watch(syncControllerProvider);
    return MaterialApp(
      title: 'Sync1 App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      // Убираем роутинг и используем AuthWrapper для управления состоянием
      // home: const AuthWrapper(),
      home: const ServerCheckUi(),
    );
  }
}
`;