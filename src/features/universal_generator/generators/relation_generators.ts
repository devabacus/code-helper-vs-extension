import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { ServerpodModel } from '../serverpod_yaml_parser/formatters/types';
import { cap, pluralConvert, toSnakeCase, unCap } from '../../../utils/text_work/text_util';
import { CodeFormatter } from '../serverpod_yaml_parser/formatters/code_formatter';
import { RelationMethodGenerator, TemplateContext } from './relation_method_generator';

export function generateDaoManyToOneMethods(model: ServerpodModel): string {
  return new RelationMethodGenerator(model).generate(ctx => `
  Future<List<${ctx.D}TableData>> ${ctx.repoMethodName}(${ctx.parameterType} ${ctx.parameterName}, {required int userId, required String customerId}) =>
    (select(${ctx.d}Table)
      ..where((t) => t.${ctx.parameterName}.equals(${ctx.parameterName}) & t.userId.equals(userId) & t.customerId.equals(customerId) & t.isDeleted.equals(false)))
    .get();`, '\n');
}

export function generateLocalDatasourceManyToOneMethods(model: ServerpodModel): string {
    return new RelationMethodGenerator(model).generate(ctx => `
  @override
  Future<List<${ctx.D}Model>> ${ctx.repoMethodName}(${ctx.parameterType} ${ctx.parameterName}, {required int userId, required String customerId}) async {
    final ${ctx.d}TableData = await _${ctx.d}Dao.${ctx.repoMethodName}(${ctx.parameterName}, userId: userId, customerId: customerId);
    return ${ctx.d}TableData.toModels();
  }`, '\n');
}

export function generateLocalDatasourceServiceManyToOneMethods(model: ServerpodModel): string {
    return new RelationMethodGenerator(model).generate(ctx =>
        `  Future<List<${ctx.D}Model>> ${ctx.repoMethodName}(${ctx.parameterType} ${ctx.parameterName}, {required int userId, required String customerId});`, '');
}

export function generateRemoteDatasourceServiceManyToOneMethods(model: ServerpodModel): string {
    return new RelationMethodGenerator(model).generate(ctx =>
        `  Future<List<${ctx.D}>> ${ctx.repoMethodName}(UuidValue ${ctx.parameterName});`, '');
}

export function generateRemoteDatasourceManyToOneMethods(model: ServerpodModel): string {
  return new RelationMethodGenerator(model).generate(ctx => `
  @override
  Future<List<${ctx.D}>> ${ctx.repoMethodName}(UuidValue ${ctx.parameterName}) async {
    try {
      final result = await _client.${ctx.d}.${ctx.repoMethodName}(${ctx.parameterName});
      return result;
    } catch (e) {
      print('Ошибка получения ${ctx.Ds} по ${ctx.methodNamePart} ID: $e');
      rethrow;
    }
  }`, '\n');
}

export function generateRepositoryImplManyToOneMethods(model: ServerpodModel): string {
  return new RelationMethodGenerator(model).generate(ctx => `
  @override
  Future<List<${ctx.D}Entity>> ${ctx.repoMethodName}(${ctx.parameterType} ${ctx.parameterName}) async {
    final ${ctx.d}s = await _localDataSource.${ctx.repoMethodName}(${ctx.parameterName}, userId: userId, customerId: customerId);
    return ${ctx.d}s.map((e) => e.toEntity()).toList();
  }`, '\n');
}

export function generateDomainRepositoryManyToOneMethods(model: ServerpodModel): string {
    return new RelationMethodGenerator(model).generate(ctx =>
        `  Future<List<${ctx.D}Entity>> ${ctx.repoMethodName}(${ctx.parameterType} ${ctx.parameterName});`, '');
}

export function generateUseCaseManyToOneMethods(model: ServerpodModel): string {
  return new RelationMethodGenerator(model).generate(ctx => `class ${ctx.useCaseClassName} {
  final I${ctx.D}Repository _repository;

  ${ctx.useCaseClassName}(this._repository);

  Future<List<${ctx.D}Entity>> call(${ctx.parameterType} ${ctx.fkFieldName}) {
    return _repository.${ctx.repoMethodName}(${ctx.fkFieldName});
  }
}`);
}

export function generateUsecaseProviderManyToOneMethods(model: ServerpodModel): string {
  const useCaseProviderName = (ctx: TemplateContext) => `${unCap(ctx.useCaseClassName)}`;
  return new RelationMethodGenerator(model).generate(ctx => `
@riverpod
${ctx.useCaseClassName}? ${useCaseProviderName(ctx)}(Ref ref) {
  final repository = ref.watch(currentUser${ctx.D}RepositoryProvider);
  if (repository == null) {
    return null;
  }
  return ${ctx.useCaseClassName}(repository);
}`, '\n');
}


export function generateDriftTableImports(model: ServerpodModel): string {
    const relationFields = model.fields.filter(field =>
      field.isRelation && field.relationType === 'manyToOne' &&
      field.relatedModel && field.name !== 'customerId'
    );
    if (relationFields.length === 0) return '';

    const imports = relationFields.map(field => {
      const tableFileName = `${toSnakeCase(field.relatedModel!)}_table.dart`;
      return `import '${tableFileName}';`;
    });
    return [...new Set(imports)].join('\n');
}

export function generateServerpodToModelParams(model: ServerpodModel): string {
    const formatter = new CodeFormatter();
    const fieldsToProcess = formatter.fieldsFilter(model.fields);

    return fieldsToProcess.map(field => {
        let fieldValue = field.name;
        if ((field.isRelation && field.relationType === 'manyToOne') || field.name === 'customerId') {
            fieldValue = `${field.name}${field.nullable ? '?' : ''}.toString()`;
        }
        return `${field.name}: ${fieldValue}`;
    }).join(',\n      ');
}

export function generateEntityToServerpodParams(model: ServerpodModel): string {
    const formatter = new CodeFormatter();
    const fieldsToProcess = formatter.fieldsFilter(model.fields);

    return fieldsToProcess.map(field => {
        let fieldValue = field.name;
        if (field.isRelation && field.relationType === 'manyToOne') {
            fieldValue = field.nullable
                ? `${field.name} == null ? null : serverpod.UuidValue.fromString(${field.name}!)`
                : `serverpod.UuidValue.fromString(${field.name})`;
        }
        return `${field.name}: ${fieldValue}`;
    }).join(',\n      ');
}