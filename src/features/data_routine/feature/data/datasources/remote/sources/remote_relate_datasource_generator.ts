import path from "path";
import { BaseGenerator } from "../../../../../../../core/generators/base_generator";
import { DefaultProjectStructureLegacy } from "../../../../../../../core/implementations/default_project_structure";
import { IFileSystem } from "../../../../../../../core/interfaces/file_system";
import { IProjectStructureLegacy } from "../../../../../../../core/interfaces/project_structure";
import { cap, pluralConvert, unCap } from "../../../../../../../utils/text_work/text_util";
import { PathData } from "../../../../../../utils/path_util";
import { ServerpodModel } from "../../../../../serverpod_yaml_parser/formatters/types";

export class DataRemoteRelateSourcesGenerator extends BaseGenerator<ServerpodModel> {

  private structure: IProjectStructureLegacy;

  constructor(fileSystem: IFileSystem, structure?: IProjectStructureLegacy) {
    super(fileSystem);
    this.structure = structure || new DefaultProjectStructureLegacy(); //
  }

  protected getPath(featurePath: string, entityName: string): string {
    return path.join(this.structure.getDataSourceRemotePath(featurePath), `${entityName}_remote_data_source.dart`);
  }

  protected getContent(model: ServerpodModel, _: string, featurePath: string): string {
    const projectName = new PathData(featurePath).projectName;

    const d1 = model.fields[1].relatedModel!;
    const d2 = model.fields[2].relatedModel!;

    const D1 = cap(d1);
    const D1s = pluralConvert(D1);
    const D2 = cap(d2);
    const D2s = pluralConvert(D2);
    const ClassName = `${model.className}`;
    const ClassNameS = pluralConvert(ClassName);
    const className = unCap(ClassName);
    const tableName = `${model.tableName}`;

    return `
import 'dart:async';
import 'package:${projectName}_client/${projectName}_client.dart';
import '../interfaces/${tableName}_remote_datasource_service.dart';

class ${ClassName}RemoteDataSource implements I${ClassName}RemoteDataSource {
  final Client _client;
  ${ClassName}RemoteDataSource(this._client);

  @override
  Future<List<${ClassName}>> get${ClassNameS}Since(DateTime? since) async {
    try {
      return await _client.${className}.get${ClassNameS}Since(since);
    } catch (e) {
      print('❌ ${ClassName}RemoteDataSource.get${ClassNameS}Since: $e');
      rethrow;
    }
  }

  @override
  Stream<${ClassName}SyncEvent> watchEvents() {
    try {
      return _client.${className}.watchEvents();
    } catch (e) {
      print('❌ Ошибка подписки на события ${ClassName}: $e');
      // Возвращаем пустой стрим в случае ошибки, чтобы приложение не падало
      return Stream.value(${ClassName}SyncEvent(type: SyncEventType.create));
    }
  }
  
  @override
  Future<bool> checkConnection() async {
    try {
      await get${ClassNameS}Since(DateTime.now().subtract(const Duration(seconds: 1)));
      return true;
    } catch (e) {
      print('Проверка подключения ${ClassName} неудачна: $e');
      return false;
    }
  }

  @override
  Future<${ClassName}> create${ClassName}(${className}) async {
    try {
      print('🚀 Remote: Отправляем на сервер создание связи ${D1}-${D2}');
      final result = await _client.${className}.create${ClassName}(${className});
      print('✅ Remote: Связь ${D1}-${D2} успешно создана на сервере');
      return result;
    } catch (e) {
      print('❌ Remote: Ошибка создания связи ${D1}-${D2} на сервере: $e');
      rethrow;
    }
  }
    
  @override
  Future<List<${D2}>> get${D2s}For${D1}(UuidValue ${d1}Id) async {
    try {
      return await _client.${className}.get${D2s}For${D1}(${d1}Id);
    } catch (e) {
      print('❌ Remote: Ошибка получения тегов для задачи $${d1}Id: $e');
      rethrow;
    }
  }

  @override
  Future<List<${D1}>> get${D1s}For${D2}(UuidValue ${d2}Id) async {
    try {
      return await _client.${className}.get${D1s}For${D2}(${d2}Id);
    } catch (e) {
      print('❌ Remote: Ошибка получения задач для тега $${d2}Id: $e');
      rethrow;
    }
  }

 @override
  Future<bool> delete${ClassName}By${D1}And${D2}(UuidValue ${d1}Id, UuidValue ${d2}Id) async {
    try {
      return await _client.${className}.delete${ClassName}By${D1}And${D2}(${d1}Id, ${d2}Id);
    } catch (e) {
      print('❌ Remote: Ошибка удаления связи по ${D1}/${D2} ID: $e');
      rethrow;
    }
  }

}`;
  }
}