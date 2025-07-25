import { CodeFormatter } from "../serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../serverpod_yaml_parser/formatters/types";
import { GenerationConfig } from "../generation_config";

// Тип для функции-генератора
type SectionGenerator = (config: GenerationConfig, model: ServerpodModel) => string;

// Реестр, где мы будем хранить все наши генераторы
const sectionGeneratorRegistry: Record<string, SectionGenerator> = {
    
    driftTableColumns: (config, model) => {
        const codeFormatter = new CodeFormatter();
        return codeFormatter.generateDriftTableColumns(model.fields);
    },

    // Сюда можно добавлять другие генераторы...
    // например, для полей в freezed-классах, конструкторов и т.д.
};

export function getSectionGenerator(name: string): SectionGenerator | undefined {
    return sectionGeneratorRegistry[name];
}