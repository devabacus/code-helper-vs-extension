
export const session_manager_provider_file = (projectName: string) => {

return`import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:serverpod_auth_shared_flutter/serverpod_auth_shared_flutter.dart';
import 'package:serverpod_auth_client/serverpod_auth_client.dart';
import 'package:${projectName}_client/${projectName}_client.dart';
import 'serverpod_client_provider.dart';

part 'session_manager_provider.g.dart';

@riverpod
SessionManager sessionManager(Ref ref) {
  ref.keepAlive();
  final client = ref.watch(serverpodClientProvider);
  final sessionManager = SessionManager(
    caller: client.modules.auth,
  );
  sessionManager.initialize();
  return sessionManager;
}

@riverpod
Stream<UserInfo?> userInfoStream(Ref ref) {
  final sessionManager = ref.watch(sessionManagerProvider);
  late StreamController<UserInfo?> controller;
  
  void listener() {
    if (!controller.isClosed) {
      controller.add(sessionManager.signedInUser);
    } 
  }
           
  controller = StreamController<UserInfo?>(
    onListen: () {
      // Отправляем текущее состояние сразу
      controller.add(sessionManager.signedInUser);
      // Подписываемся на изменения
      sessionManager.addListener(listener);
    },
    onCancel: () {
      sessionManager.removeListener(listener);
    },
  );
  
  ref.onDispose(() {
    sessionManager.removeListener(listener);
    controller.close();
  });
  
  return controller.stream;
}

@riverpod
UserInfo? currentUser(Ref ref) {
  final asyncUserInfo = ref.watch(userInfoStreamProvider);
  return asyncUserInfo.valueOrNull;
}

@riverpod
bool isAuthenticated(Ref ref) {
  final user = ref.watch(currentUserProvider);
  return user != null;
}

@riverpod
class UserSessionDataNotifier extends _$UserSessionDataNotifier {
  @override
  UserSessionData? build() {
    // Слушаем изменения статуса аутентификации пользователя
    ref.listen(userInfoStreamProvider, (previous, next) async {
      if (next.hasValue && next.value != null && previous?.value == null) {
        // Пользователь только что вошел в систему
        await _fetchUserContext();
      } else if (next.value == null && previous?.value != null) {
        // Пользователь вышел из системы
        state = null;
      }
    });
    return null; // Изначальное состояние
  }

  // Метод для вызова эндпоинта на сервере и получения UserSessionData
  Future<void> _fetchUserContext() async {
    state = null; // Очищаем предыдущее состояние
    final client = ref.read(serverpodClientProvider);

    try {
      // Вызываем эндпоинт на сервере для получения UserSessionData
      // Предполагается, что UserManagementEndpoint уже настроен на сервере
      final userContext = await client.userManagement.getMyUserContext();
      state = userContext; // Обновляем состояние провайдера
      print('✅ Получен User Context: $userContext');
    } catch (e, st) {
      print('❌ Ошибка получения User Context: $e\n$st');
      state = null; // Очищаем состояние в случае ошибки
    }
  }

  // Метод для ручного обновления контекста (если понадобится)
  Future<void> refreshUserContext() => _fetchUserContext();
}

// Провайдер, который просто смотрит за состоянием UserSessionDataNotifier
@riverpod
UserSessionData? currentUserSessionData(Ref ref) {
  return ref.watch(userSessionDataNotifierProvider);
}

// Провайдер для получения customerId из UserSessionData
@riverpod
String? currentCustomerId(Ref ref) {
  return ref.watch(currentUserSessionDataProvider)?.customerId.toString();
}

// Провайдер для получения roleId из UserSessionData
@riverpod
UuidValue? currentRoleId(Ref ref) {
  return ref.watch(currentUserSessionDataProvider)?.roleId;
}

// Провайдер для получения списка активных разрешений
@riverpod
List<String> currentUserPermissions(Ref ref) {
  return ref.watch(currentUserSessionDataProvider)?.activePermissions ?? [];
}


`;};


