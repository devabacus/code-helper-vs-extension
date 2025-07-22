import { cap, pluralConvert, toPascalCase, unCap } from "../../utils/text_work/text_util";
import { GenerationServiceConfig } from "./generators/generation_service";
import { ReplacementRule } from "./generators/replacing_file_processor";
import { ProjectConfig } from "./project_config";

export interface dictionaries {
    
}



 export function getDictionaryRules(dictionaries: readonly string[], config: ProjectConfig): ReplacementRule[] {
    const rules: ReplacementRule[] = [];

    for (const dict of dictionaries) {
      if (dict === 'common') {
        // замена project name
        rules.push({ from: config.templProject, to: config.targetProject });
      }
      if (dict === 'entity' && config.targetEntity.length !== 0) {
        
    const baseForms = {
        Ds: pluralConvert(cap(config.templEntity)),
        D: cap(config.templEntity),         
        d: unCap(config.templEntity),       
    };

    const newForms = {
        Ds: pluralConvert(cap(config.targetEntity)), 
        D: cap(config.targetEntity),  
        d: unCap(config.targetEntity),
    };
        
        rules.push(
            {from: config.templProject, to: config.targetProject}, //project replace
            { from: baseForms.Ds, to: newForms.Ds },
            { from: baseForms.D, to: newForms.D },
            { from: baseForms.d, to: newForms.d },
        );
      }
    }

    return rules;
  }