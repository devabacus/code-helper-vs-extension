export const new_page = (widgetName: string) => {

return `

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ${widgetName} extends ConsumerWidget {
  const ${widgetName}({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("${widgetName}"),
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