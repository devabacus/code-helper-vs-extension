import { cap } from "../../../../utils/text_work/text_util";

export const fMainPgPth = (featurePath: string, featureName: string) => `${featurePath}/presentation/pages/${featureName}_page.dart`;


export const fMainPgCont = (featureName: string) => {
  const capFeature = cap(featureName);

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

`;
};