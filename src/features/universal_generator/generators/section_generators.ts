import { CodeFormatter } from "../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../serverpod_yaml_parser/formatters/types";
import { GenerationConfig } from "../paths/generation_config";

export const GENERATORS = {
    DRIFT_TABLE_COLUMNS: 'driftTableColumns',
    FREEZED_FIELDS: 'freezedFields',
    FREEZED_CONSTRUCTOR: 'freezedConstructor',
    DAO_METHODS: 'daoMethods',
    VALUE_WRAPPED_FIELDS: 'valueWrappedFields',
    SIMPLE_FIELDS: 'simpleFields'

} as const;

export const DEFAULT_MARKERS = {
    START: '// === GENERATED_START ===',
    END: '// === GENERATED_END ==='
} as const;

// Тип для функции-генератора
type SectionGenerator = (config: GenerationConfig, model: ServerpodModel) => string;

// Реестр, где мы будем хранить все наши генераторы
const sectionGeneratorRegistry: Record<string, SectionGenerator> = {

    [GENERATORS.DRIFT_TABLE_COLUMNS]: (config, model) => {
        const codeFormatter = new CodeFormatter();
        return codeFormatter.generateDriftTableColumns(model.fields);
    },

    [GENERATORS.FREEZED_FIELDS]: (config, model) => {
        const formatter = new CodeFormatter();
        return formatter.formatClassFields(model.fields);
    },

    [GENERATORS.FREEZED_CONSTRUCTOR]: (config, model) => {
        const formatter = new CodeFormatter();
        return formatter.formatRequiredTypeFields(model.fields);
    },

    [GENERATORS.VALUE_WRAPPED_FIELDS]: (config, model) => {
        const formatter = new CodeFormatter();
        return formatter.formatValueWrappedFields(model.fields);
    },
    [GENERATORS.SIMPLE_FIELDS]: (config, model) => {
        const formatter = new CodeFormatter();
        return formatter.formatSimpleFields(model.fields);
    },
    // formatValueWrappedFields
    // Сюда можно добавлять другие генераторы...
    // например, для полей в freezed-классах, конструкторов и т.д.
};

export function getSectionGenerator(name: string): SectionGenerator | undefined {
    return sectionGeneratorRegistry[name];
}