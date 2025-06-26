import { getDocText } from "../../../ui/ui_util";
import { ServerpodYamlParser } from "./parser";
import { RelationAnalyzer } from "./relation-analyzer";
import { TypeMapper } from "./type-mappers";



export async function parseYaml() {
 
const yamlContent = getDocText();    

const model = ServerpodYamlParser.parse(yamlContent);
console.log(model);

// const relations = RelationAnalyzer.getModelRelations(model);
// console.log(relations);

// const driftColumn = TypeMapper.mapToDriftColumn('String');
// console.log(driftColumn); // 'text'
}

