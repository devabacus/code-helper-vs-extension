// src/features/data_routine/generators/endpoint_relate_generator.ts

import * as path from 'path';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { cap, unCap, toSnakeCase, pluralConvert } from '../../../utils/text_work/text_util';

/**
 * Generates the Serverpod endpoint for a many-to-many relation table,
 * following the user's specific coding style.
 */
export class EndpointRelateGenerator {
    constructor(private fileSystem: IFileSystem) { }

    async generate(
        serverProjectPath: string,
        model: ServerpodModel,
    ): Promise<void> {
        const endpointsDir = path.join(serverProjectPath, 'lib', 'src', 'endpoints');
        const filePath = path.join(endpointsDir, `${toSnakeCase(model.className)}_endpoint.dart`);
        const projectName = path.basename(serverProjectPath).split('_')[0];

        const content = this.getContent(projectName, model);

        await this.fileSystem.createFile(filePath, content);
    }

    private getContent(projectName: string, model: ServerpodModel): string {
        if (model.fields.length < 2 || !model.fields.every(f => f.isRelation)) {
            console.warn(`EndpointRelateGenerator: Модель ${model.className} не является валидной таблицей для связи. Генерация пропущена.`);
            return '';
        }

        // 1. Определяем Source и Target
        const sourceField = model.fields[0];
        const targetField = model.fields[1];

        // Имена, как они указаны в YAML
        const sourceName = sourceField.name; // task
        const targetName = targetField.name; // tag

        // Имена классов сущностей (первая буква заглавная)
        const D1 = cap(sourceName); // Task
        const D2 = cap(targetName); // Tag

        // Имена переменных (первая буква строчная)
        const d1 = unCap(D1); // task
        const d2 = unCap(D2); // tag
        
        // Имена во множественном числе
        const D1s = pluralConvert(D1); // Tasks
        const D2s = pluralConvert(D2); // Tags

        // Имя класса самой связующей модели
        const Rel = model.className; // TaskTagMap
        const rel = unCap(Rel);      // taskTagMap

        return `import 'package:serverpod/serverpod.dart';
import 'package:${projectName}_server/src/generated/protocol.dart';

// Manages the many-to-many relationship between ${D1} and ${D2}.
class ${Rel}Endpoint extends Endpoint {

  /// Connects a ${D1} to a ${D2}.
  Future<void> add${Rel}(Session session, {
    required UuidValue ${d1}Id,
    required UuidValue ${d2}Id,
  }) async {
    // Check if relation already exists to prevent duplicates.
    final existingRelation = await ${Rel}.db.findFirstRow(
      session,
      where: (t) => t.${d1}Id.equals(${d1}Id) & t.${d2}Id.equals(${d2}Id),
    );

    if (existingRelation == null) {
        final relation = ${Rel}(
            ${d1}Id: ${d1}Id,
            ${d2}Id: ${d2}Id,
        );
        await ${Rel}.db.insertRow(session, relation);
    }
  }

  /// Disconnects a ${D1} from a ${D2}.
  Future<void> remove${Rel}(Session session, {
    required UuidValue ${d1}Id,
    required UuidValue ${d2}Id,
  }) async {
    await ${Rel}.db.deleteWhere(
      session,
      where: (t) => t.${d1}Id.equals(${d1}Id) & t.${d2}Id.equals(${d2}Id),
    );
  }

  /// Gets all ${D2s} associated with a specific ${D1}.
  Future<List<${D2}>> get${D2s}For${D1}(Session session, UuidValue ${d1}Id) async {
    final relations = await ${Rel}.db.find(
      session,
      where: (t) => t.${d1}Id.equals(${d1}Id),
    );

    if (relations.isEmpty) {
      return [];
    }
    
    final ${d2}Ids = relations.map((e) => e.${d2}Id).whereType<UuidValue>().toSet();

    if (${d2}Ids.isEmpty) {
        return [];
    }

    return ${D2}.db.find(
      session,
      where: (t) => t.id.inSet(${d2}Ids),
    );
  }

  /// Gets all ${D1s} associated with a specific ${D2}.
  Future<List<${D1}>> get${D1s}For${D2}(Session session, UuidValue ${d2}Id) async {
    final relations = await ${Rel}.db.find(
      session,
      where: (t) => t.${d2}Id.equals(${d2}Id),
    );

    if (relations.isEmpty) {
      return [];
    }

    final ${d1}Ids = relations.map((e) => e.${d1}Id).whereType<UuidValue>().toSet();
    
    if (${d1}Ids.isEmpty) {
        return [];
    }

    return ${D1}.db.find(
      session,
      where: (t) => t.id.inSet(${d1}Ids),
    );
  }
}
`;
    }
}