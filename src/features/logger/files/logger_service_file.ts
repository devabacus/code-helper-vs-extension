
export const logger_service_file = `
import 'package:flutter/material.dart';
import 'package:talker_flutter/talker_flutter.dart';

abstract class LoggerService {
  void info(dynamic msg);
  void warning(dynamic msg);
  void debug(dynamic msg);
  void error(dynamic msg, [Object? exception, StackTrace? stackTrace]);
  void critical(dynamic msg, [Object? exception, StackTrace? stackTrace]);
  void showLogs(BuildContext context);
}

// Реализация через Talker
class TalkerLoggerService implements LoggerService {
  final Talker talker;

  TalkerLoggerService(this.talker);

  @override
  void debug(dynamic msg) => talker.debug(msg);

  @override
  void error(dynamic msg, [Object? exception, StackTrace? stackTrace]) {
    talker.error(msg, exception, stackTrace);
  }

  @override
  void info(dynamic msg) => talker.info(msg);

  @override
  void warning(dynamic msg) => talker.warning(msg);

  @override
  void critical(dynamic msg, [Object? exception, StackTrace? stackTrace]) {
    talker.critical(msg, exception, stackTrace);
  }

  @override
  void showLogs(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => TalkerScreen(talker: talker)),
    );
  }
}

// Mock реализация для тестов
class MockLoggerService implements LoggerService {
  final List<String> logs = [];

  @override
  void debug(dynamic msg) => logs.add('DEBUG: $msg');

  @override
  void error(dynamic msg, [Object? exception, StackTrace? stackTrace]) {
    logs.add('ERROR: $msg \${exception ?? ''}');
  }

  @override
  void info(dynamic msg) => logs.add('INFO: $msg');

  @override
  void warning(dynamic msg) => logs.add('WARNING: $msg');

  @override
  void critical(dynamic msg, [Object? exception, StackTrace? stackTrace]) {
    logs.add('CRITICAL: $msg \${exception ?? ''}');
  }

  @override
  void showLogs(BuildContext context) {
    // Ничего не делаем в тестах
  }
}
`;