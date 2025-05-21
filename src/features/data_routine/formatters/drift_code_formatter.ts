// src/features/data_routine/formatters/drift_code_formatter.ts

import { TcpSocketConnectOpts } from 'net';
import { IDriftCodeFormatter } from './drift_code_formatter.interface';
import { Field, FieldValue } from '../feature/data/datasources/local/tables/drift_class_parser'; // Field теперь с isNullable
import { prepareFieldsForTest } from './drift_prepare_fields_for_test';

export class DriftCodeFormatter implements IDriftCodeFormatter {

  formatClassFields(fields: Field[]): string { // Используем обновленный Field
    // Для объявления полей класса в Freezed, тип также должен быть nullable
    const fieldRows = fields.map(field => `final ${field.type}${field.isNullable ? '?' : ''} ${field.name};`);
    return fieldRows.join('\n');
  }

  formatRequiredFields(fields: Field[]): string { // Используем обновленный Field
    // Этот метод используется для `this.fieldName`, здесь isNullable не влияет на `required`
    // так как это для другого типа конструктора (не Freezed). Оставляем как есть, если он используется для Equatable.
    // Если он ТОЛЬКО для Freezed и Equatable вы хотите обрабатывать иначе - нужна доп. логика или отдельный метод.
    // Пока предположим, что это для Equatable или подобного.
    const fieldRows = fields.map(field => `required this.${field.name},`);
    return fieldRows.join('\n');
  }

  formatRequiredTypeFields(fields: Field[]): string { // Используем обновленный Field
    const fieldRows = fields.map(field => {
      const typeString = `${field.type}${field.isNullable ? '?' : ''}`;
      // Для Freezed: non-nullable поля без @Default становятся required автоматически.
      // Nullable поля - опциональные.
      // Мы можем явно указывать required для non-nullable для ясности или если того требует стиль.
      // Для nullable 'required' не ставим.
      if (field.isNullable) {
        return `${typeString} ${field.name},`;
      } else {
        // Поля id часто имеют clientDefault, поэтому они не должны быть required в конструкторе модели/сущности,
        // если мы хотим позволить их создание без явного указания id (он сгенерируется).
        // Но для простоты, пока оставим required для всех non-nullable, кроме потенциального id.
        // Это поведение возможно потребуется уточнить для полей с @Default в Freezed.
        // На данный момент, если поле не nullable, оно будет 'required'.
        return `required ${typeString} ${field.name},`;
      }
    });
    return fieldRows.join('\n');
  }

  formatConstructorParams(fields: Field[], instanceName: string = ''): string { // Используем обновленный Field
    if (instanceName) {
      return fields.map(field => `${field.name}: ${instanceName}.${field.name}`).join(', ');
    }
    return fields.map(field => `${field.name}: ${field.name}`).join(', ');
  }

  formatFieldsComma(fields: Field[]): string { // Используем обновленный Field
    return fields.map(field => field.name).join(',');
  }

  formatValueWrappedFields(fields: Field[]): string { // Используем обновленный Field
    // Здесь isNullable не влияет на Value(), но важно, чтобы тип поля в Drift Companion был правильным
    return fields.map(field => `${field.name}: Value(${field.name})`).join(', ');
  }

  formatSimpleFields(fields: Field[]): string { // Используем обновленный Field
    return fields.map(field => `${field.name}: ${field.name}`).join(', ');
  }

  formatSimpleFieldsWithoutId(fields: Field[]): string { // Используем обновленный Field
    const withoutId = fields.filter(field => field.name !== 'id');
    return this.formatSimpleFields(withoutId);
  }

  getParamsWithOutId(row: string): string {
    return row.replace(/.*id,\s?/, '');
  }


  getFieldsValueForTest(fields: Field[]): string[] { // Используем обновленный Field
    const fieldsList: FieldValue[] = prepareFieldsForTest(fields);
    const firstRow = fieldsList.map((item) => `${item.name}: ${item.value}`).join(', ');
    const secondRow = firstRow.replaceAll('1', '2').replace('false', 'true');
    let wrapped = secondRow.replaceAll(/(\w+):\s*(.*?)(?:,|$)/g, '$1: Value($2),');
    wrapped = `id: Value(testId), ` + wrapped.slice(0, -1);

    return [firstRow, secondRow, wrapped];
  }

  getFieldsExpectValueTest(fields: Field[]): string[] { // Используем обновленный Field
    const fieldsList: FieldValue[] = prepareFieldsForTest(fields);
    const firstRow = `.${fieldsList[0].name}, ${fieldsList[0].value}`;
    const secondRow = firstRow.replace('1', '2');
    return [firstRow, secondRow];
  }

    formatInsertCompanionParams(fields: Field[]): string {
    const insertFields = fields.filter(field => field.name !== 'id');
    return insertFields.map(field => {
      if (field.isNullable) {
        // Для nullable полей всегда используем Value()
        return `${field.name}: Value(${field.name})`;
      } else {
        // Для non-nullable полей передаем значение напрямую
        return `${field.name}: ${field.name}`;
      }
    }).join(', ');
  }
}