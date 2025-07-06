import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructure } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { ProjectStructure } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../../../utils/text_work/text_util";
import { PathData } from "../../../../../../utils/path_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";
import { RelationAnalyzer } from "../../../../../serverpod_yaml_parser/relation-analyzer";

export class DataRemoteSourcesGenerator extends BaseGenerator<ServerpodModel> {

  private structure: ProjectStructure;

  constructor(fileSystem: IFileSystem, structure?: ProjectStructure) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructure(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataSourceRemotePath(featurePath), `${entityName}_remote_data_source.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const D = model.className;
    const d = unCap(model.className);
    const ds = pluralConvert(d);
    const Ds = pluralConvert(D);

    // Генерация методов для получения по внешнему ключу
    let foreignKeyMethods = '';
    const manyToOneFields = RelationAnalyzer.manyToOneFields(model.fields);


    if (manyToOneFields.length > 0) {
      foreignKeyMethods = manyToOneFields.map(field => {
        const fkFieldName = field.name.endsWith('Id') ? field.name : `${field.name}Id`;
        const methodNamePart = cap(field.name.replace(/Id$/, ''));
        const dsMethodName = `get${Ds}By${methodNamePart}Id`;
        const parameterName = fkFieldName;

        return `
  @override
  Future<List<${D}>> ${dsMethodName}(UuidValue ${parameterName}) async {
    try {
      final result = await _client.${d}.${dsMethodName}(${parameterName});
      return result;
    } catch (e) {
      print('Ошибка получения ${Ds} по ${methodNamePart} ID: $e');
      rethrow;
    }
  }`;
      }).join('');
    }
    return `import 'dart:async';
import 'package:${projectName}_client/${projectName}_client.dart';
import '../interfaces/${d}_remote_datasource_service.dart';

class ${D}RemoteDataSource implements I${D}RemoteDataSource {
  final Client _client;

  ${D}RemoteDataSource(this._client);

  @override
  Future<List<${D}>> get${Ds}() async {
    try {
      final ${ds} = await _client.${d}.get${Ds}();
      return ${ds};
    } catch (e) {
      print('Ошибка получения: $e');
      rethrow;
    }
  }

  @override
  Future<List<${D}>> get${Ds}Since(DateTime? since) async {
    try {
      final ${ds} = await _client.${d}.get${Ds}Since(since);
      return ${ds};
    } catch (e) {
      print('Ошибка получения c $since: $e');
      rethrow;
    }
  }

  @override
  Future<${D}?> get${D}ById(UuidValue id) async {
    try {
      final ${d} = await _client.${d}.get${D}ById(id);
      return ${d};
    } catch (e) {
      print('Ошибка получения по ID $id: $e');
      rethrow;
    }
  }

  @override
  Future<${D}> create${D}(${D} ${d}) async {
    print('🚀 Remote: Отправляем на сервер: \${_client.host}');

    try {
      final result = await _client.${d}.create${D}(${d});
      print('✅ Remote: Успешно создано на сервере');
      return result;
    } catch (e) {
      print('❌ Remote: Ошибка создания на сервере: $e');
      rethrow;
    }
  }

  @override
  Future<bool> update${D}(${D} ${d}) async {
    try {
      final result = await _client.${d}.update${D}(${d});
      return result;
    } catch (e) {
      print('Ошибка обновления: $e');
      rethrow;
    }
  }

  @override
  Stream<${D}SyncEvent> watchEvents() {
    try {
      return _client.${d}.watchEvents();
    } catch (e) {
      print('❌ Ошибка подписки на события сервера: $e');
      return Stream.value(${D}SyncEvent(type: SyncEventType.create));
    }
  }

  @override
  Future<bool> checkConnection() async {
    try {
      await _client.${d}.get${Ds}(limit: 1);
      return true;
    } catch (e) {
      print('Проверка подключения неудачна: $e');
      return false;
    }
  }

  @override
  Future<List<${D}>> sync${Ds}(List<${D}> local${Ds}) async {
    try {
      final server${Ds} = await get${Ds}();

      print(
        'Синхронизация: локальных \${local${Ds}.length}, серверных \${server${Ds}.length}',
      );
      return server${Ds};
    } catch (e) {
      print('Ошибка синхронизации: $e');
      return local${Ds};
    }
  }

${foreignKeyMethods}
}

`;
  }
}