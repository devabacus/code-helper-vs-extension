import { capitalize } from "../../../../../utils/text_work/text_util";

export const mainFile = `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import './app.dart';
import 'package:talker_riverpod_logger/talker_riverpod_logger.dart';


void main() {
  runApp(
  ProviderScope(
    observers: [
      TalkerRiverpodObserver(),
    ],
    child: App(),
  )
 );
}
`;

export const appFile = `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/routing/router_config.dart';


class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.read(appRouterProvider);
    return MaterialApp.router(routerConfig: router);
  }
}
`;


export const featureMainPageContent = (featureName: string) => {
  const capFeature = capitalize(featureName);
  
return `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../providers/${featureName}_navigation_provider.dart';

class ${capFeature}Page extends ConsumerWidget {
  const ${capFeature}Page({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final ${featureName}NavService = ref.read(${featureName}NavigationServiceProvider);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("${capFeature}Page"),
            SizedBox(height: 30),
            ElevatedButton(
              onPressed: () => {},
              child: Text("ButtonText"),
            ),
          ],
        ),
      ),
    );
  }
}

`;};


export const featurePageContent = (featureName: string, pageName: string) => {
  // const capFeature = capitalize(featureName);
  const capPageName = capitalize(pageName);
  
return `
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../providers/${featureName}_navigation_provider.dart';

class ${capPageName}Page extends ConsumerWidget {
  const ${capPageName}Page({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // final ${featureName}NavService = ref.read(${featureName}NavigationServiceProvider);

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("${capPageName}Page"),
            SizedBox(height: 30),
            ElevatedButton(
              onPressed: () => {},
              child: Text("ButtonText"),
            ),
          ],
        ),
      ),
    );
  }
}

`;};