import { cap, pluralConvert, unCap } from "../../../utils/text_work/text_util";
import { readFileSync } from "fs";
import { generatorConfig } from "../core/config/config";

export function createReplacementDictionary(baseName: string, newName: string) {

    const baseForms = {
        Ds: pluralConvert(cap(baseName)),   // Categories
        D: cap(baseName),                  // Category
        d: unCap(baseName),         // category
    };

    const newForms = {
        Ds: pluralConvert(cap(newName)),    // Products
        D: cap(newName),                   // Product
        d: unCap(newName),          // product
    };

    return [
        { from: baseForms.Ds, to: newForms.Ds },
        { from: baseForms.D, to: newForms.D },
        { from: baseForms.d, to: newForms.d },
    ];
}

export function entityReplacement(sourceFilePath: string, newEntity: string) {
    const dictionary = createReplacementDictionary(generatorConfig.entityName, newEntity);
    let newContent = readFileSync(sourceFilePath, 'utf-8');
    for (const rule of dictionary) {
        // new RegExp(rule.from, 'g') создает регулярное выражение для глобальной замены
        newContent = newContent.replace(new RegExp(rule.from, 'g'), rule.to);
    }
    return newContent;
}
