


export const startApp = `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:talker_riverpod_logger/talker_riverpod_logger.dart';
import '../core/routing/router_config.dart';


void main() {
  runApp(
  ProviderScope(
    observers: [
      TalkerRiverpodObserver(),
    ],
    child: MyApp(),
  )
 );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.read(appRouterProvider);
    return MaterialApp.router(routerConfig: router);
  }
}


`;

