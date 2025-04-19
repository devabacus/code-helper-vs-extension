import { Field, FieldValue } from "../feature/data/datasources/local/tables/drift_class_parser";

export function prepareFieldsForTest(fields: Field[]):FieldValue[] {
    // const formatted = new Map<FieldValue>();

    const formattedList :FieldValue[] = [];

    // 1. Обрабатываем входные поля (кроме id) и сохраняем в Map
    for (const field of fields) {
        if (field.name === 'id') {
            continue;
        }

        let formattedValue: string;
        switch (field.type) {
            case 'String':
                formattedValue = `'${field.name} 1'`;
                break;
            case 'int':
                formattedValue = `1`;
                break;
            case 'DateTime':
                formattedValue = `DateTime(1)`;
                break;
            case 'bool':
                formattedValue = `false`;
                break;
            default:
                console.warn(`Неизвестный тип поля для форматирования теста: ${field.type}`);
                continue;
        }
        // formattedMap.set(field.name, formattedValue);
        formattedList.push({name: field.name, value: formattedValue});

    }
    return formattedList;


}


