export const database_types_file = `
import 'package:drift/drift.dart';

enum SyncStatus { local, synced, conflict, deleted }

class SyncStatusConverter extends TypeConverter<SyncStatus, String> {
  const SyncStatusConverter();
  @override
  SyncStatus fromSql(String fromDb) {
    return SyncStatus.values.byName(fromDb);
  }

  @override
  String toSql(SyncStatus value) {
    return value.name;
  }
}

class MillisecondEpochConverter extends TypeConverter<DateTime, int> {
  const MillisecondEpochConverter();
  
  @override
  DateTime fromSql(int fromDb) {
    return DateTime.fromMillisecondsSinceEpoch(fromDb, isUtc: true);
  }

  @override
  int toSql(DateTime value) {
    return value.millisecondsSinceEpoch;
  }
}
`;