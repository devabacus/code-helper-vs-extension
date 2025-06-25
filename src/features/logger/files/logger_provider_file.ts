export const logger_provider_file = `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:talker_flutter/talker_flutter.dart';

import '../services/logger/logger_service.dart';

part 'logger_provider.g.dart';

// Провайдер для конкретного экземпляра Talker. Нужен для интеграций.
@Riverpod(keepAlive: true)
Talker talker(Ref ref) {
  return TalkerFlutter.init(
    settings: TalkerSettings(
      useConsoleLogs: true,
      enabled: true,
    ),
  );
}

// Провайдер для вашего абстрактного сервиса. Зависит от провайдера выше.
@Riverpod(keepAlive: true)
LoggerService loggerService(Ref ref) {
  final talkerInstance = ref.watch(talkerProvider);
  return TalkerLoggerService(talkerInstance);
  // return MockLoggerService();
}
`;