
export const serverpodClientProviderFile = (projectName: string) => {
    return `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:${projectName}_client/${projectName}_client.dart';
import 'package:serverpod_auth_shared_flutter/serverpod_auth_shared_flutter.dart';
import '../config/config.dart';

part 'serverpod_client_provider.g.dart';

class ServerpodConfig {
  final String serverUrl;
  final bool enableLogging;

  const ServerpodConfig({
    required this.serverUrl,
    this.enableLogging = true,
  });
}

@riverpod
ServerpodConfig serverpodConfig(Ref ref) {
  return ServerpodConfig(
    serverUrl: AppConfig.baseUrl,
    enableLogging: true,
  );
}

@riverpod
Client serverpodClient(Ref ref) {
  ref.keepAlive();
  final config = ref.watch(serverpodConfigProvider);
  
  final client = Client(
    config.serverUrl,
    authenticationKeyManager: FlutterAuthenticationKeyManager(),
  );

  if (config.enableLogging) {
    print('Serverpod client создан для \${config.serverUrl}');
  }

  ref.onDispose(() {
    if (config.enableLogging) {
      print('Serverpod client dispose');
    }
  });

  return client;
}

@riverpod
Future<bool> serverpodConnectionCheck(Ref ref) async {
  final client = ref.watch(serverpodClientProvider);
  
  try {
    await client.modules.auth.status.getUserInfo();
    return true;
  } catch (e) {
    print('Ошибка подключения к серверу: $e');
    return false;
  }
}

enum ConnectionStatus {
  unknown,
  connected,
  disconnected,
}

extension ConnectionStatusExtension on ConnectionStatus {
  bool get isConnected => this == ConnectionStatus.connected;
  bool get isDisconnected => this == ConnectionStatus.disconnected;
  bool get isUnknown => this == ConnectionStatus.unknown;

  String get displayName {
    switch (this) {
      case ConnectionStatus.connected:
        return 'Подключен';
      case ConnectionStatus.disconnected:
        return 'Отключен';
      case ConnectionStatus.unknown:
        return 'Неизвестно';
    }
  }

  String get colorName {
    switch (this) {
      case ConnectionStatus.connected:
        return 'green';
      case ConnectionStatus.disconnected:
        return 'red';
      case ConnectionStatus.unknown:
        return 'grey';
    }
  }
}
`;};
