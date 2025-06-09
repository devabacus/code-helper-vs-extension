export const mainFile = (projectName: string) => { 
  return `
import 'package:flutter/material.dart';
import 'package:serverpod_flutter/serverpod_flutter.dart';
import 'package:${projectName}/check/server_check_ui.dart';
import 'package:${projectName}_client/${projectName}_client.dart';

// var client = Client('http://localhost:8080/')
var client = Client('https://api5.my-points.ru/')
  ..connectivityMonitor = FlutterConnectivityMonitor();

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Category Test',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const ServerCheckUi(),
    );
  }
}

`;};