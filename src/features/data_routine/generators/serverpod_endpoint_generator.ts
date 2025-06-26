import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator'; //
import { IFileSystem } from '../../../core/interfaces/file_system'; //
import { DriftClassParser, Field as DriftClassField } from '../feature/data/datasources/local/tables/drift_class_parser'; //
import { cap, unCap, toSnakeCase, pluralConvert } from '../../../utils/text_work/text_util'; //
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';

export class ServerpodEndpointGenerator extends BaseGenerator<{ classParser: DriftClassParser, tableParser: DriftTableParser }> {
    constructor(fileSystem: IFileSystem) {
        super(fileSystem);
    }

    protected getPath(basePath: string, entityNamePascalCase?: string): string {
        return path.join(basePath, `${toSnakeCase(entityNamePascalCase!)}_endpoint.dart`); 
    }
    
    protected getContent(
        data?: { classParser: DriftClassParser, tableParser: DriftTableParser },
        entityNamePascalCase?: string, // Это classNamePascal
        baseEndpointsPath?: string     // Путь к директории endpoints серверного проекта
    ): string {
        if (!data || !entityNamePascalCase || !baseEndpointsPath) {
            throw new Error("Данные (classParser, tableParser), имя сущности (PascalCase) и baseEndpointsPath обязательны для содержимого ServerpodEndpointGenerator.");
        }

        const { classParser, tableParser } = data;

        const D = entityNamePascalCase; // Task
        const d = unCap(D); // task
        const Ds = pluralConvert(D); // Tasks

     
        let foreignKeyEndpointMethods = '';
        const references = tableParser.getReferences(); //

        if (references && references.length > 0) {
            foreignKeyEndpointMethods = references.map(ref => {
                const fkColumnName = ref.columnName; // e.g., ${d}Id (из Drift таблицы)
                
                let methodNamePart = cap(fkColumnName.replace(/Id$/, '')); 

                const endpointMethodName = `get${Ds}By${methodNamePart}Id`;

                return `
  Future<List<${D}>> ${endpointMethodName}(Session session, UuidValue ${fkColumnName}) async {
    return await ${D}.db.find(
      session,
      where: (c) => c.${fkColumnName}.equals(${fkColumnName}),
      orderBy: (c) => c.id,
    );
  }
`;
            }).join('\n');
        }

        return `import 'package:serverpod/serverpod.dart';
import 'package:sync1_server/src/generated/protocol.dart';

const _${d}ChannelBase = 'sync1_${d}_events_for_user_';

class ${D}Endpoint extends Endpoint {
  
  Future<int> _getAuthenticatedUserId(Session session) async {
    final authInfo = await session.authenticated;
    final userId = authInfo?.userId;

    if (userId == null) {
      throw Exception('Пользователь не авторизован.');
    }
    return userId;
  }

  Future<void> _notifyChange(Session session, ${D}SyncEvent event, int userId) async {
    final channel = '$_${d}ChannelBase$userId';
    await session.messages.postMessage(channel, event);
    session.log('🔔 Событие \${event.type.name} отправлено в канал "$channel"');
  }

  Future<${D}> create${D}(Session session, ${D} ${d}) async {
  final userId = await _getAuthenticatedUserId(session);

  final existing${D} = await ${D}.db.findFirstRow(
    session,
    where: (c) => c.id.equals(${d}.id) & c.userId.equals(userId),
  );

  final server${D} = ${d}.copyWith(
      userId: userId,
      lastModified: DateTime.now().toUtc(),
      isDeleted: false,
  );

  if (existing${D} != null) {
    session.log('ℹ️ "create${D}" вызван для существующего ID. Выполняется обновление (воскрешение).');
    final updated${D} = await ${D}.db.updateRow(session, server${D});

    await _notifyChange(session, ${D}SyncEvent(
        type: SyncEventType.update, 
        ${d}: updated${D},
    ), userId);
    return updated${D};

  } else {
    final created${D} = await ${D}.db.insertRow(session, server${D});
    await _notifyChange(session, ${D}SyncEvent(
        type: SyncEventType.create,
        ${d}: created${D},
    ), userId);
    return created${D};
  }
}

${foreignKeyEndpointMethods}

  Future<List<${D}>> get${Ds}(Session session, {int? limit}) async {
    final userId = await _getAuthenticatedUserId(session);
    return await ${D}.db.find(
      session,
      where: (c) => c.userId.equals(userId) & c.isDeleted.equals(false),
      orderBy: (c) => c.title,         
      limit: limit
    );
  }     

   Future<${D}?> get${D}ById(Session session, UuidValue id) async {
    final userId = await _getAuthenticatedUserId(session);
    
    return await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(id) & c.userId.equals(userId) & c.isDeleted.equals(false),
    );
  }

  Future<List<${D}>> get${Ds}Since(Session session, DateTime? since) async {
    final userId = await _getAuthenticatedUserId(session);
    if (since == null) {
      return get${Ds}(session);
    }
    return await ${D}.db.find(
      session,
      where: (c) => c.userId.equals(userId) & (c.lastModified >= since),
      orderBy: (c) => c.lastModified,
    );
  }

  Future<bool> update${D}(Session session, ${D} ${d}) async {
    final userId = await _getAuthenticatedUserId(session);
    final original${D} = await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(${d}.id) & c.userId.equals(userId) & c.isDeleted.equals(false),
    );
    if (original${D} == null) {
      return false; 
    }
    final server${D} = ${d}.copyWith(
      userId: userId,
      lastModified: DateTime.now().toUtc(),
    );
    try {
      await ${D}.db.updateRow(session, server${D});
      await _notifyChange(session, ${D}SyncEvent(
        type: SyncEventType.update,
        ${d}: server${D},
      ), userId);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> delete${D}(Session session, UuidValue id) async {
    final userId = await _getAuthenticatedUserId(session);
    final original${D} = await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(id) & c.userId.equals(userId),
    );

    if (original${D} == null) return false;
    final tombstone = original${D}.copyWith(
      isDeleted: true,
      lastModified: DateTime.now().toUtc(),
    );

    final result = await ${D}.db.updateRow(session, tombstone);

    await _notifyChange(session, ${D}SyncEvent(
      type: SyncEventType.delete,
      ${d}: result, 
      id: id,
    ), userId);

    return true;
  }

  Stream<${D}SyncEvent> watchEvents(Session session) async* {
    final userId = await _getAuthenticatedUserId(session);
    final channel = '$_${d}ChannelBase$userId';
    session.log('🟢 Клиент (user: $userId) подписался на события в канале "$channel"');
    try {
      await for (var event in session.messages.createStream<${D}SyncEvent>(channel)) {
        session.log('🔄 Пересылаем событие \${event.type.name} клиенту (user: $userId)');
        yield event;
      }
    } finally {
      session.log('🔴 Клиент (user: $userId) отписался от канала "$channel"');
    }
  }
}          
`;
    }
}