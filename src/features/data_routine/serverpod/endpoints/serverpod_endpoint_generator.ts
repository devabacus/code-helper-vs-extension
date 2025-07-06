import * as path from 'path';
import { IFileSystem } from '../../../../core/interfaces/file_system';
import { ServerpodModel } from '../../serverpod_yaml_parser/formatters/types';
import { cap, unCap, toSnakeCase, pluralConvert } from '../../../../utils/text_work/text_util';
import { BaseGenerator } from '../../../../core/generators/base_generator';
import { addServerpodModel } from '../../generators/add_serverpod_model';
import { ProjectStructure } from '../../../../core/interfaces/project_structure';
import { DefaultProjectStructure } from '../../../../core/implementations/default_project_structure';
import { PathData } from '../../../utils/path_util';
import { RelationAnalyzer } from '../../serverpod_yaml_parser/relation-analyzer';

export class ServerpodEndpointGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    const serverPath = featurePath.split('lib')[0].replace('flutter', 'server');
    return path.join(serverPath, 'lib', 'src', 'endpoints', `${entityName}_endpoint.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const D = model.className;
    const d = unCap(model.className);
    const Ds = pluralConvert(D);

    // Получаем поля связей для генерации методов foreign key
    let foreignKeyEndpointMethods = '';
    const relationFields = RelationAnalyzer.manyToOneFields(model.fields);

    if (relationFields.length > 0) {
      foreignKeyEndpointMethods = relationFields.map(field => {
        // field.name может быть "${d}Id" или "${d}", поэтому нужно правильно обработать
        const fieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, '')); // ${d} -> ${D}
        const endpointMethodName = `get${Ds}By${methodNamePart}Id`; // getTasksBy${D}Id
        const parameterName = fieldName; // ${d}Id

        return `
Future<List<${D}>> ${endpointMethodName}(Session session, UuidValue ${parameterName}) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;
    return await ${D}.db.find(
      session,
      where: (t) => t.${parameterName}.equals(${parameterName}) & t.userId.equals(userId) & t.customerId.equals(customerId),
    );
  }`;
      }).join('\n');
    }

    return `import 'package:serverpod/serverpod.dart';
import 'package:${projectName}_server/src/generated/protocol.dart';
import 'shared/auth_context_mixin.dart';
import 'user_manager_endpoint.dart';

const _${d}ChannelBase = '${projectName}_${d}_events_for_user_';

class ${D}Endpoint extends Endpoint with AuthContextMixin {
  
  Future<void> _notifyChange(Session session, ${D}SyncEvent event, AuthenticatedUserContext authContext) async { 
    final channel = '$_${d}ChannelBase\${authContext.userId}-\${authContext.customerId.uuid}'; 
    await session.messages.postMessage(channel, event);
    session.log('🔔 Событие \${event.type.name} отправлено в канал "$channel"');
  }

  Future<${D}> create${D}(Session session, ${D} ${d}) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    final existing${D} = await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(${d}.id) & c.userId.equals(userId) & c.customerId.equals(customerId),
    );

    final server${D} = ${d}.copyWith(
        userId: userId,
        customerId: customerId,
        lastModified: DateTime.now().toUtc(),
        isDeleted: false,
    );

    if (existing${D} != null) {
      session.log('ℹ️ "create${D}" вызван для существующего ID. Выполняется обновление (воскрешение).');
      final updated${D} = await ${D}.db.updateRow(session, server${D});

      await _notifyChange(session, ${D}SyncEvent(
          type: SyncEventType.update, 
          ${d}: updated${D},
      ), authContext); 
      return updated${D};

    } else {
      final created${D} = await ${D}.db.insertRow(session, server${D});
      await _notifyChange(session, ${D}SyncEvent(
          type: SyncEventType.create,
          ${d}: created${D},
      ), authContext); 
      return created${D};
    }
  }

  Future<List<${D}>> get${Ds}(Session session, {int? limit}) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    return await ${D}.db.find(
      session,
      where: (c) => c.userId.equals(userId) & c.customerId.equals(customerId) & c.isDeleted.equals(false),
      limit: limit
    );
  }     

  Future<${D}?> get${D}ById(Session session, UuidValue id) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;
    
    return await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(id) & c.userId.equals(userId) & c.customerId.equals(customerId) & c.isDeleted.equals(false),
    );
  }

  Future<List<${D}>> get${Ds}Since(Session session, DateTime? since) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    if (since == null) {
      return get${Ds}(session);
    }
    return await ${D}.db.find(
      session,
      where: (c) => c.userId.equals(userId) & c.customerId.equals(customerId) & (c.lastModified >= since),
      orderBy: (c) => c.lastModified,
    );
  }

  Future<bool> update${D}(Session session, ${D} ${d}) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    final original${D} = await ${D}.db.findFirstRow(
      session,
      where: (c) => c.id.equals(${d}.id) & c.userId.equals(userId) & c.customerId.equals(customerId) & c.isDeleted.equals(false),
    );
    if (original${D} == null) {
      return false; 
    }
    final server${D} = ${d}.copyWith(
      userId: userId,
      customerId: customerId,
      lastModified: DateTime.now().toUtc(),
    );
    try {
      await ${D}.db.updateRow(session, server${D});
      await _notifyChange(session, ${D}SyncEvent(
        type: SyncEventType.update,
        ${d}: server${D},
      ), authContext);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  Stream<${D}SyncEvent> watchEvents(Session session) async* {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    final channel = '$_${d}ChannelBase$userId-\${customerId.uuid}'; 
    session.log('🟢 Клиент (user: $userId, customer: \${customerId.uuid}) подписался на события в канале "$channel"');
    try {
      await for (var event in session.messages.createStream<${D}SyncEvent>(channel)) {
        session.log('🔄 Пересылаем событие \${event.type.name} клиенту (user: $userId, customer: \${customerId.uuid})');
        yield event;
      }
    } finally {
      session.log('🔴 Клиент (user: $userId, customer: \${customerId.uuid}) отписался от канала "$channel"');
    }
  }   
    ${foreignKeyEndpointMethods}
}          `;
  }
}