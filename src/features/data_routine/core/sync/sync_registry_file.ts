export const sync_registry_file = `
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'sync_registry.g.dart';

/// Абстракция для любого репозитория, который может быть синхронизирован.
/// Любой репозиторий, реализующий этот интерфейс, может быть добавлен в SyncRegistry.
abstract class ISyncableRepository {
  /// Запускает полный цикл синхронизации (pull, reconcile, push).
  Future<void> syncWithServer();

  /// Инициализирует подписку на real-time события с сервера.
  void initEventBasedSync();

  /// Освобождает ресурсы (например, отписывается от стримов).
  void dispose();

  /// Возвращает имя сущности для логирования.
  String get entityTypeName;
}

/// Центральный реестр для управления всеми синхронизируемыми репозиториями.
class SyncRegistry {
  final Map<String, ISyncableRepository> _repositories = {};

  /// Регистрирует новый репозиторий в реестре.
  void registerRepository(String key, ISyncableRepository repository) {
    print('✅ Реестр: Зарегистрирован репозиторий с ключом "$key"');
    _repositories[key] = repository;
  }

  /// Удаляет репозиторий из реестра.
  /// Обычно вызывается при уничтожении провайдера репозитория.
  void unregisterRepository(String key) {
    print('🛑 Реестр: Регистрация для ключа "$key" снята');
    _repositories.remove(key);
  }

  /// Запускает синхронизацию для всех зарегистрированных репозиториев.
  Future<void> syncAll() async {
    print('🔄 Реестр: Запуск синхронизации для всех \${_repositories.length} репозиториев...');
    for (final repository in _repositories.values) {
      try {
        // Мы не вызываем initEventBasedSync здесь, так как он вызывается
        // внутри syncWithServer или при создании самого репозитория.
        await repository.syncWithServer();
      } catch (e) {
        print(
            '❌ Реестр: Ошибка синхронизации для "\${repository.entityTypeName}": $e');
      }
    }
  }

  /// Возвращает список всех зарегистрированных репозиториев.
  List<ISyncableRepository> get repositories => _repositories.values.toList();
}

/// Провайдер для единственного экземпляра реестра на все приложение.
@Riverpod(keepAlive: true)
SyncRegistry syncRegistry(Ref ref) {
  return SyncRegistry();
}
`;