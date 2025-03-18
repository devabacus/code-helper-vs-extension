





export const home_page = 
`
import 'package:flutter/material.dart';
import 'package:mlogger/mlogger.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("myApp")),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Center(child: Text("MyApp")),
          SizedBox(height: 30),
          ElevatedButton(
            onPressed: () => log.debug("button pressed"),
            child: Text("Button"),
          ),
        ],
      ),
    );
  }
}

`;