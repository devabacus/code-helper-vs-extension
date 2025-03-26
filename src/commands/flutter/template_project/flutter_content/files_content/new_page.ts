export const new_page = (pageName: string) => {
`

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ${pageName}Page extends ConsumerWidget {
  const ${pageName}Page({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("${pageName}Page"),
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