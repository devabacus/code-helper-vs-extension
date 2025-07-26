// universal_generator/generators/relation_generators.ts

import { RelationAnalyzer } from '../serverpod_yaml_parser/relation-analyzer';
import { ServerpodModel, ServerpodField } from '../serverpod_yaml_parser/formatters/types';
import { cap, pluralConvert, toSnakeCase, unCap } from '../../../utils/text_work/text_util';

// Интерфейс для контекста, который будет доступен в каждом шаблоне
export interface TemplateContext {
  D: string;
  d: string;
  Ds: string;
  fkFieldName: string;
  methodNamePart: string;
  repoMethodName: string;
  parameterName: string;
  parameterType: string;
  useCaseClassName: string;
}

// Наш универсальный генератор
export class RelationMethodGenerator {
  private model: ServerpodModel;
  private D: string;
  private d: string;
  private Ds: string;

  constructor(model: ServerpodModel) {
    this.model = model;
    this.D = model.className;
    this.d = unCap(model.className);
    this.Ds = pluralConvert(this.D);
  }

  // Главный метод, который принимает функцию-шаблон
  public generate(templateFn: (ctx: TemplateContext) => string, joiner: string = '\n\n'): string {
    const relationFields = RelationAnalyzer.manyToOneFields(this.model.fields);
    if (relationFields.length === 0) {
      return '';
    }

    return relationFields
      .map(field => {
        // Вычисляем все необходимые переменные ОДИН РАЗ
        const methodNamePart = cap(field.name.replace(/Id$/, ""));
        const context: TemplateContext = {
          D: this.D,
          d: this.d,
          Ds: this.Ds,
          fkFieldName: field.name.endsWith("Id") ? field.name : `${field.name}Id`,
          methodNamePart: methodNamePart,
          repoMethodName: `get${this.Ds}By${methodNamePart}Id`,
          parameterName: field.name.endsWith("Id") ? field.name : `${field.name}Id`,
          parameterType: "String",
          useCaseClassName: `Get${this.Ds}By${methodNamePart}IdUseCase`,
        };
        // Вызываем переданную функцию-шаблон с этим контекстом
        return templateFn(context);
      })
      .join(joiner);
  }
}