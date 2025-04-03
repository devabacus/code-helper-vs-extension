import { cap } from "../../../utils/text_work/text_util";


export const featurePageContent = (featureName: string, pageName: string) => {
  // const capFeature = capitalize(featureName);
  const capPageName = cap(pageName);

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

`;
};