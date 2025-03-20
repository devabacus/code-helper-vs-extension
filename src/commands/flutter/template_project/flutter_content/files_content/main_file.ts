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