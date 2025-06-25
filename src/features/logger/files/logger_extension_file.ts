
export const logger_extension_file = `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/logger_provider.dart';
import 'logger_service.dart';

extension RefExtensions on Ref {
  LoggerService get logger => read(loggerServiceProvider);
}

extension WidgetRefExtensions on WidgetRef {
  LoggerService get logger => read(loggerServiceProvider);
}
`;