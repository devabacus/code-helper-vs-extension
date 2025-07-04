import { cap } from "../../../utils/text_work/text_util";

export const sync_metadata_table_file = `import 'package:drift/drift.dart';

@DataClassName('SyncMetadataEntry')
class SyncMetadata extends Table {

  TextColumn get entityType => text()();
  IntColumn get userId => integer()();
  TextColumn get customerId => text()();  
  DateTimeColumn get lastSyncTimestamp => dateTime().nullable()();
  IntColumn get syncVersion => integer().withDefault(const Constant(1))();
  DateTimeColumn get updatedAt => dateTime()();

  @override
  Set<Column> get primaryKey => {entityType};
}
`;