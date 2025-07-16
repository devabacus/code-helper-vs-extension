import * as path from 'path';
import { BaseGenerator } from '../../../../core/generators/base_generator';
import { DefaultProjectStructureLegacy } from '../../../../core/implementations/default_project_structure';
import { IFileSystem } from '../../../../core/interfaces/file_system';
import { IProjectStructureLegacy } from '../../../../core/interfaces/project_structure';
import { cap, pluralConvert, unCap } from '../../../../utils/text_work/text_util';
import { PathData } from '../../../utils/path_util';
import { ServerpodModel } from '../../serverpod_yaml_parser/formatters/types';

export class ServerpodRelateEndpointGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    const serverPath = featurePath.split('lib')[0].replace('flutter', 'server');
    return path.join(serverPath, 'lib', 'src', 'endpoints', `${entityName}_endpoint.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const d1 = model.fields[1].relatedModel!; //TODO need to fix очень хрупко
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`;
    const ClassNameS = pluralConvert(ClassName);
    const tableName = `${model.tableName}`;
    const className = unCap(ClassName);
    const classNameS = pluralConvert(className);

    return `import 'package:serverpod/serverpod.dart';
import 'package:${projectName}_server/src/generated/protocol.dart';
import 'shared/auth_context_mixin.dart';
import 'user_manager_endpoint.dart';

const _${className}ChannelBase = '${projectName}_${tableName}_events_for_user_';

class ${ClassName}Endpoint extends Endpoint with AuthContextMixin {
  
  Future<void> _notifyChange(Session session, ${ClassName}SyncEvent event, AuthenticatedUserContext authContext) async {
    final channel = '$_${className}ChannelBase\${authContext.userId}-\${authContext.customerId.uuid}';
    await session.messages.postMessage(channel, event);
    session.log('🔔 Событие ${ClassName} \${event.type.name} отправлено в канал "$channel"');
  }

  Future<void> _validate${D1}And${D2}(Session session, ${ClassName} model) async {
    // Проверяем, что ${D1} существует и принадлежит пользователю
    final ${d1} = await ${D1}.db.findFirstRow(
      session,
      where: (t) =>
          t.id.equals(model.${d1}Id) &
          t.userId.equals(model.userId) &
          t.customerId.equals(model.customerId) &
          t.isDeleted.equals(false),
    );
    if (${d1} == null) {
      throw Exception(
          '${D1} с ID \${model.${d1}Id} не найден или не принадлежит пользователю');
    }

    // Проверяем, что ${D2} существует и принадлежит пользователю
    final ${d2} = await ${D2}.db.findFirstRow(
      session,
      where: (t) =>
          t.id.equals(model.${d2}Id) &
          t.userId.equals(model.userId) &
          t.customerId.equals(model.customerId) &
          t.isDeleted.equals(false),
    );
    if (${d2} == null) {
      throw Exception(
          '${D2} с ID \${model.${d2}Id} не найден или не принадлежит пользователю');
    }
  }

  Future<${ClassName}> create${ClassName}(
      Session session, ${ClassName} ${className}) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    final ${d1}Id = ${className}.${d1}Id;
    final ${d2}Id = ${className}.${d2}Id;

    // Валидация входных данных
    await _validate${D1}And${D2}(session, ${className});

    return await session.db.transaction((transaction) async {
      // Ищем существующую связь (включая удаленные) внутри транзакции
      final existingRelation = await ${ClassName}.db.findFirstRow(
        session,
        where: (r) =>
            r.${d1}Id.equals(${d1}Id) &
            r.${d2}Id.equals(${d2}Id) &
            r.userId.equals(userId) & r.customerId.equals(customerId)            ,
        transaction: transaction,
      );

      final now = DateTime.now().toUtc();
      ${ClassName} result;

      if (existingRelation != null) {
        if (!existingRelation.isDeleted) {
          // Связь уже существует и активна
          session.log('ℹ️ Связь ${D1}($${d1}Id) ↔ ${D2}($${d2}Id) уже существует');
          return existingRelation;
        }

        // "Воскрешаем" удаленную связь
        session
            .log('ℹ️ Воскрешаем удаленную связь ${D1}($${d1}Id) ↔ ${D2}($${d2}Id)');
        result = await ${ClassName}.db.updateRow(
          session,
          existingRelation.copyWith(isDeleted: false, lastModified: now),
          transaction: transaction,
        );

        await _notifyChange(
            session,
            ${ClassName}SyncEvent(
              type: SyncEventType.update,
              ${className}: result,
            ),
            authContext);
      } else {
        // Создаем новую связь
        result = await ${ClassName}.db.insertRow(
          session,
          ${ClassName}(
            ${d1}Id: ${d1}Id,
            ${d2}Id: ${d2}Id,
            userId: userId,
            customerId: ${className}.customerId,
            createdAt: ${className}.createdAt,
            lastModified: DateTime.now().toUtc(),
            isDeleted: false,
          ),
          transaction: transaction,
        );

        await _notifyChange(
            session,
            ${ClassName}SyncEvent(
              type: SyncEventType.create,
              ${className}: result,
            ),
            authContext);
      }

      session.log(
          '✅ Создана связь ${D1}($${d1}Id) ↔ ${D2}($${d2}Id) для пользователя $userId');
      return result;
    });
  }
    
  Future<List<${D2}>> get${D2s}For${D1}(Session session, UuidValue ${d1}Id) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;


    // Сначала проверяем, что задача существует и принадлежит пользователю
    final ${d1} = await ${D1}.db.findFirstRow(
      session,
      where: (t) => t.id.equals(${d1}Id) & t.userId.equals(userId) & t.customerId.equals(customerId) & t.isDeleted.equals(false),
    );
    
    if (${d1} == null) {
      throw Exception('${D1} с ID $${d1}Id не найден или не принадлежит пользователю');
    }

    // Получаем ID тегов через связующую таблицу
    final ${classNameS} = await ${ClassName}.db.find(
      session,
      where: (ttm) => ttm.${d1}Id.equals(${d1}Id) & 
                      ttm.userId.equals(userId) & 
                      ttm.customerId.equals(customerId) & 
                      ttm.isDeleted.equals(false),
    );

    if (${classNameS}.isEmpty) {
      return [];
    }

    final ${d2}Ids = ${classNameS}.map((ttm) => ttm.${d2}Id).toSet();

    // Получаем сами теги
    return await ${D2}.db.find(
      session,
      where: (t) => t.id.inSet(${d2}Ids) & 
                    t.userId.equals(userId) & 
                    t.customerId.equals(customerId) & 
                    t.isDeleted.equals(false),
      orderBy: (t) => t.title,
    );
  }

  Future<List<${D1}>> get${D1s}For${D2}(Session session, UuidValue ${d2}Id) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    // Сначала проверяем, что тег существует и принадлежит пользователю
    final ${d2} = await ${D2}.db.findFirstRow(
      session,
      where: (t) => t.id.equals(${d2}Id) & t.userId.equals(userId) & t.customerId.equals(customerId) & t.isDeleted.equals(false),
    );
    
    if (${d2} == null) {
      throw Exception('${D2} с ID $${d2}Id не найден или не принадлежит пользователю');
    }

    // Получаем ID задач через связующую таблицу
    final ${classNameS} = await ${ClassName}.db.find(
      session,
      where: (ttm) => ttm.${d2}Id.equals(${d2}Id) & 
                      ttm.userId.equals(userId) & 
                      ttm.customerId.equals(customerId) & 
                      ttm.isDeleted.equals(false),
    );

    if (${classNameS}.isEmpty) {
      return [];
    }

    final ${d1}Ids = ${classNameS}.map((ttm) => ttm.${d1}Id).toSet();

    // Получаем сами задачи
    return await ${D1}.db.find(
      session,
      where: (t) => t.id.inSet(${d1}Ids) & 
                    t.userId.equals(userId) & 
                    t.customerId.equals(customerId) & 
                    t.isDeleted.equals(false),
      orderBy: (t) => t.title,
    );
  }

  Future<List<${ClassName}>> get${ClassNameS}Since(Session session, DateTime? since) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;
    
    return await ${ClassName}.db.find(
      session,
      // Возвращаем все записи (включая удаленные), которые изменились после 'since'
      where: (r) => r.userId.equals(userId) & r.customerId.equals(customerId) & (since == null ? Constant.bool(true) : r.lastModified >= since),
      orderBy: (r) => r.lastModified,
    );
  }

  Stream<${ClassName}SyncEvent> watchEvents(Session session) async* {
    final authContext = await getAuthenticatedUserContext(session);
  final userId = authContext.userId;
  final customerId = authContext.customerId;
    
    // final channel = '$_${className}ChannelBase$userId';
      final channel = '$_${className}ChannelBase$userId-\${customerId.uuid}';
    session.log('🟢 Клиент (user: $userId) подписался на события ${ClassName} в канале "$channel"');

    try {
      await for (var event in session.messages.createStream<${ClassName}SyncEvent>(channel)) {
        session.log('🔄 Пересылаем событие ${ClassName} \${event.type.name} клиенту (user: $userId)');
        yield event;
      }
    } finally {
      session.log('🔴 Клиент (user: $userId) отписался от канала ${ClassName} "$channel"');
    }
  }

Future<bool> delete${ClassName}By${D1}And${D2}(Session session, UuidValue ${d1}Id, UuidValue ${d2}Id) async {
    final authContext = await getAuthenticatedUserContext(session);
    final userId = authContext.userId;
    final customerId = authContext.customerId;

    return await session.db.transaction((transaction) async {
        // Находим активную связь по бизнес-ключу
        final relation = await ${ClassName}.db.findFirstRow(
            session,
            where: (r) => r.${d1}Id.equals(${d1}Id) & r.${d2}Id.equals(${d2}Id) & r.userId.equals(userId) & r.customerId.equals(customerId) & r.isDeleted.equals(false),
            transaction: transaction,
        );

        if (relation == null) {
            session.log('⚠️ Попытка удалить несуществующую или уже удаленную связь: ${D1}($${d1}Id) <-> ${D2}($${d2}Id)');
            return false; // Запись не найдена или уже удалена, считаем операцию успешной.
        }

        // "Мягкое" удаление найденной связи
        final tombstone = relation.copyWith(
            isDeleted: true,
            lastModified: DateTime.now().toUtc(),
        );

        final result = await ${ClassName}.db.updateRow(session, tombstone, transaction: transaction);

        // Уведомляем клиентов об удалении, используя серверный ID, который они знают (или получат)
        await _notifyChange(session, ${ClassName}SyncEvent(
            type: SyncEventType.update,
            id: result.id, // Отправляем ID удаленной записи
            ${className}: result,
        ), authContext);

        session.log('✅ Удалена связь ${D1}($${d1}Id) <-> ${D2}($${d2}Id) для пользователя $userId');
        return true;
    });
  }


}`;
  }
}