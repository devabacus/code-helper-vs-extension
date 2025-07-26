import { CodeFormatter } from "../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../serverpod_yaml_parser/formatters/types";
import { GenerationConfig } from "../paths/generation_config";
import { RelationAnalyzer } from "../serverpod_yaml_parser/relation-analyzer";
import { cap, pluralConvert, unCap } from "../../../utils/text_work/text_util";
import { generateDaoManyToOneMethods, generateDriftTableImports, generateLocalDatasourceManyToOneMethods, generateLocalDatasourceServiceManyToOneMethods, generateRemoteDatasourceManyToOneMethods, generateRemoteDatasourceServiceManyToOneMethods } from "./relation_generators";

export const GENERATORS = {
    DRIFT_TABLE_COLUMNS: 'driftTableColumns',
    DRIFT_TABLE_IMPORTS: 'driftTableImports',
    FREEZED_FIELDS: 'freezedFields',
    FREEZED_CONSTRUCTOR: 'freezedConstructor',
    DAO_METHODS: 'daoMethods',
    VALUE_WRAPPED_FIELDS: 'valueWrappedFields',
    SIMPLE_FIELDS: 'simpleFields',
    
    DAO_RELATION_METHODS: 'daoRelationMethods', 
    ENTITY_RELATION_FIELDS: 'entityRelationFields', 
    LOCAL_DATASOURCE_RELATION_METHODS: 'localDatasourceRelationMethods',
    LOCAL_DATASOURCE_SERVICE_RELATION_METHODS: 'localDatasourceServiceRelationMethods', 
    REMOTE_DATASOURCE_SERVICE_RELATION_METHODS: 'remoteDatasourceServiceRelationMethods',
    REMOTE_DATASOURCE_RELATION_METHODS: 'remoteDatasourceRelationMethods', 

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
     [GENERATORS.DRIFT_TABLE_IMPORTS]: (config, model) => {
        return generateDriftTableImports(model);
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


   [GENERATORS.DAO_RELATION_METHODS]: (config, model) => {
        return generateDaoManyToOneMethods(model);
    },

     [GENERATORS.LOCAL_DATASOURCE_RELATION_METHODS]: (config, model) => {
        return generateLocalDatasourceManyToOneMethods(model);
    },

      [GENERATORS.LOCAL_DATASOURCE_SERVICE_RELATION_METHODS]: (config, model) => generateLocalDatasourceServiceManyToOneMethods(model),
    [GENERATORS.REMOTE_DATASOURCE_SERVICE_RELATION_METHODS]: (config, model) => generateRemoteDatasourceServiceManyToOneMethods(model),
    [GENERATORS.REMOTE_DATASOURCE_RELATION_METHODS]: (config, model) => generateRemoteDatasourceManyToOneMethods(model),

    // formatValueWrappedFields
    // Сюда можно добавлять другие генераторы...
    // например, для полей в freezed-классах, конструкторов и т.д.
};

export function getSectionGenerator(name: string): SectionGenerator | undefined {
    return sectionGeneratorRegistry[name];
}


