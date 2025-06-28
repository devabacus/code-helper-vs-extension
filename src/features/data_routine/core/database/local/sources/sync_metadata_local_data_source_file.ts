export const sync_metadata_local_datasource_file = `import '../daos/sync_metadata_dao.dart';
import '../interface/sync_metadata_local_datasource_service.dart';

class SyncMetadataLocalDataSource implements ISyncMetadataLocalDataSource {
  final SyncMetadataDao _syncMetadataDao;

  SyncMetadataLocalDataSource(this._syncMetadataDao);

  @override
  Future<DateTime?> getLastSyncTimestamp(String entityType, {required int userId}) {
    return _syncMetadataDao.getLastSyncTimestamp(entityType, userId: userId);
  }

  @override
  Future<void> updateLastSyncTimestamp(String entityType, DateTime timestamp, {required int userId}) {
    return _syncMetadataDao.updateLastSyncTimestamp(entityType, timestamp, userId: userId);
  }

  @override
  Future<int> getSyncVersion(String entityType, {required int userId}) {
    return _syncMetadataDao.getSyncVersion(entityType, userId: userId);
  }

  @override
  Future<void> updateSyncVersion(String entityType, int version, {required int userId}) {
    return _syncMetadataDao.updateSyncVersion(entityType, version, userId: userId);
  }

  @override
  Future<void> clearSyncMetadata(String entityType, {required int userId}) {
    return _syncMetadataDao.clearSyncMetadata(entityType, userId: userId);
  }
}

`;