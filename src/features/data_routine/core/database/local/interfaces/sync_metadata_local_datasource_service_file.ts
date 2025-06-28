export const sync_metadata_local_datasource_service_file = `abstract class ISyncMetadataLocalDataSource {
  /// Получает время последней успешной синхронизации для указанной сущности и пользователя.
  /// Возвращает null, если метаданные для этой сущности еще не существуют.
  Future<DateTime?> getLastSyncTimestamp(String entityType, {required int userId});

  /// Обновляет время последней успешной синхронизации для указанной сущности и пользователя.
  /// Если запись для сущности не существует, она будет создана.
  Future<void> updateLastSyncTimestamp(String entityType, DateTime timestamp, {required int userId});

  /// Получает версию синхронизации для указанной сущности и пользователя.
  /// Возвращает дефолтное значение (1), если метаданные для этой сущности еще не существуют.
  Future<int> getSyncVersion(String entityType, {required int userId});

  /// Обновляет версию синхронизации для указанной сущности и пользователя.
  /// Если запись для сущности не существует, она будет создана.
  Future<void> updateSyncVersion(String entityType, int version, {required int userId});

  /// Удаляет метаданные для указанной сущности и пользователя.
  Future<void> clearSyncMetadata(String entityType, {required int userId});
}
`;