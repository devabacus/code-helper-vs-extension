import { cap, pluralConvert, unCap } from "../../utils/text_work/text_util";

export function createReplacementDictionary(baseName: string, newName: string, projectName: string) {

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
        { from: 't2', to: 't3' },
        { from: baseForms.Ds, to: newForms.Ds },
        { from: baseForms.D, to: newForms.D },
        { from: baseForms.d, to: newForms.d },
    ];
}
