// src/features/data_routine/generators/serverpod_relate_endpoint_generator.ts
import * as path from 'path';
import { DefaultProjectStructure } from '../../../core/implementations/default_project_structure';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ProjectStructure } from '../../../core/interfaces/project_structure';
import { DriftClassParser } from '../feature/data/datasources/local/tables/drift_class_parser';
import { DriftTableParser } from '../feature/data/datasources/local/tables/drift_table_parser';
import { RelateDataRoutineGenerator } from './relate_data_routine_generator';

export class ServerpodRelateEndpointGenerator extends RelateDataRoutineGenerator {

    constructor(fileSystem: IFileSystem, projectStructure?: ProjectStructure) {
        super(fileSystem, projectStructure || new DefaultProjectStructure());
    }

    protected getRelatePath(baseEndpointsPath: string, intermediateTableNamePascalCase: string, parser: DriftClassParser): string {
        // baseEndpointsPath здесь будет serverProjectEndpointsDir
        // intermediateTableNamePascalCase - имя промежуточной таблицы, например, TaskTagMap
        this.initializeRelationProperties(parser); // Убедимся, что свойства инициализированы
        return path.join(baseEndpointsPath, `${this.intermediateSnake}_endpoint.dart`);
    }

    private getPkFieldType(tableParser: DriftTableParser, fieldName: string): string {
        const pkField = tableParser.getFields().find(f => f.name === fieldName);
        if (pkField) {
            if (pkField.type === "String") { // Drift 'TextColumn' парсится как 'String'
                return "UuidValue";
            } else if (pkField.type === "int") { // Drift 'IntColumn' парсится как 'int'
                return "int";
            }
        }
        console.warn(`Не удалось точно определить тип для поля ${fieldName} в эндпоинте. Используется UuidValue по умолчанию.`);
        return "UuidValue";
    }

    // Метод getContent из RelateDataRoutineGenerator уже вызывает getRelateContent с нужными параметрами
    // так что нет необходимости его переопределять здесь, если логика RelateDataRoutineGenerator.getContent подходит.

    // Изменена сигнатура для приема serverProjectEndpointsDir (бывший basePathForContent)
    protected getRelateContent(parser: DriftClassParser, entityName?: string, serverProjectEndpointsDir?: string): string {
        this.initializeRelationProperties(parser); // Гарантирует, что все this.* свойства установлены

        const intermediateClassName = this.intermediateUpper; // TaskTagMap
        const intermediateVarName = this.intermediateCamel;   // taskTagMap

        const sourceClassName = this.sourceUpper;  // Task
        const sourceVarName = this.sourceSnake;    // task (для map.${sourceVarName})
        const sourceIdParamName = this.sourceForeignKey; // taskId
        const sourcePluralPascal = this.sourcePlural; // Tasks

        const targetClassName = this.targetUpper;  // Tag
        const targetVarName = this.targetSnake;    // tag (для map.${targetVarName})
        const targetIdParamName = this.targetForeignKey; // tagId
        const targetPluralPascal = this.targetPlural; // Tags

        const tableParser = new DriftTableParser(parser.driftClass);
        const sourceIdType = this.getPkFieldType(tableParser, this.sourceForeignKey);
        const targetIdType = this.getPkFieldType(tableParser, this.targetForeignKey);

        if (!serverProjectEndpointsDir) {
            throw new Error("serverProjectEndpointsDir (basePathForContent) is required for ServerpodRelateEndpointGenerator.getRelateContent");
        }
        
        const serverProjectLibPath = path.join(serverProjectEndpointsDir, '..', '..');
        const serverProjectRootPath = path.join(serverProjectLibPath, '..');
        const serverProjectNameSnake = path.basename(serverProjectRootPath);

        return `import 'package:serverpod/serverpod.dart';
import 'package:${serverProjectNameSnake}/src/generated/protocol.dart';

class ${intermediateClassName}Endpoint extends Endpoint {
  Future<void> add${targetClassName}To${sourceClassName}(Session session, ${sourceIdType} ${sourceIdParamName}, ${targetIdType} ${targetIdParamName}) async {
    final ${sourceVarName}Exists = await ${sourceClassName}.db.findById(session, ${sourceIdParamName});
    if (${sourceVarName}Exists == null) {
      throw Exception('${sourceClassName} with id \$${sourceIdParamName} not found.');
    }

    final ${targetVarName}Exists = await ${targetClassName}.db.findById(session, ${targetIdParamName});
    if (${targetVarName}Exists == null) {
      throw Exception('${targetClassName} with id \$${targetIdParamName} not found.');
    }

    final existingLink = await ${intermediateClassName}.db.findFirstRow(
      session,
      where: (map) => map.${sourceIdParamName}.equals(${sourceIdParamName}) & map.${targetIdParamName}.equals(${targetIdParamName}),
    );

    if (existingLink == null) {
      final ${intermediateVarName} = ${intermediateClassName}(${sourceIdParamName}: ${sourceIdParamName}, ${targetIdParamName}: ${targetIdParamName});
      await ${intermediateClassName}.db.insertRow(session, ${intermediateVarName});
    }
  }

  Future<void> remove${targetClassName}From${sourceClassName}(Session session, ${sourceIdType} ${sourceIdParamName}, ${targetIdType} ${targetIdParamName}) async {
    await ${intermediateClassName}.db.deleteWhere(
      session,
      where: (map) => map.${sourceIdParamName}.equals(${sourceIdParamName}) & map.${targetIdParamName}.equals(${targetIdParamName}),
    );
  }

  Future<List<${targetClassName}>> get${targetPluralPascal}For${sourceClassName}(Session session, ${sourceIdType} ${sourceIdParamName}) async {
    final maps = await ${intermediateClassName}.db.find(
      session,
      where: (map) => map.${sourceIdParamName}.equals(${sourceIdParamName}),
      include: ${intermediateClassName}.include(
        ${targetVarName}: ${targetClassName}.include(),
      ),
    );
    return maps.map((map) => map.${targetVarName}).whereType<${targetClassName}>().toList();
  }

  Future<List<${sourceClassName}>> get${sourcePluralPascal}With${targetClassName}(Session session, ${targetIdType} ${targetIdParamName}) async {
    final maps = await ${intermediateClassName}.db.find(
      session,
      where: (map) => map.${targetIdParamName}.equals(${targetIdParamName}),
      include: ${intermediateClassName}.include(
        ${sourceVarName}: ${sourceClassName}.include(),
      ),
    );
    return maps.map((map) => map.${sourceVarName}).whereType<${sourceClassName}>().toList();
  }

  Future<void> removeAll${targetPluralPascal}From${sourceClassName}(Session session, ${sourceIdType} ${sourceIdParamName}) async {
    await ${intermediateClassName}.db.deleteWhere(
      session,
      where: (map) => map.${sourceIdParamName}.equals(${sourceIdParamName}),
    );
  }
}
`;
    }
}