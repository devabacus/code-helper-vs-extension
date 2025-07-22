// import { CodeFormatter } from "../data_routine/serverpod_yaml_parser/formatters/code_formatter";
// import { ServerpodModel } from "../data_routine/serverpod_yaml_parser/formatters/types";

// export interface ContentProcessor {
//   process(content: string, model: ServerpodModel, projectName: string): string;
// }

// export class SimpleReplacementProcessor implements ContentProcessor {
//   process(content: string, model: ServerpodModel, targetProjectName: string): string {
//     const dictionary = createReplacementDictionary('category', model.className, targetProjectName);
//     let newContent = content;

//     for (const rule of dictionary) {
//       newContent = newContent.replace(new RegExp(rule.from, 'g'), rule.to);
//     }

//     return newContent;
//   }
// }

// // 



// // export class PatternBasedProcessor implements ContentProcessor {
// //   constructor(private codeFormatter: CodeFormatter) { }

// //   process(content: string, model: ServerpodModel, projectName: string): string {
// //     // 1. Простая замена entity
// //     let newContent = new SimpleReplacementProcessor().process(content, model, projectName);

// //     // 2. Замена секций по маркерам
// //     newContent = this.replaceSections(newContent, model);

// //     return newContent;
// //   }

// //   private replaceSections(content: string, model: ServerpodModel): string {

// //     const sections = [
// //       {
// //         start: '// === GENERATED_COLUMNS_START ===',
// //         end: '// === GENERATED_COLUMNS_END ===',
// //         generator: () => this.codeFormatter.generateDriftTableColumns(model.fields)
// //       },
// //       {
// //         start: '// === GENERATED_FIELDS_START ===',
// //         end: '// === GENERATED_FIELDS_END ===',
// //         generator: () => this.codeFormatter.formatClassFields(model.fields)
// //       },
// //       {
// //         start: '// === GENERATED_CONSTRUCTOR_START ===',
// //         end: '// === GENERATED_CONSTRUCTOR_END ===',
// //         generator: () => this.codeFormatter.formatRequiredTypeFields(model.fields)
// //       }
// //     ];

// //     for (const section of sections) {
// //       content = this.replaceSection(
// //         content,
// //         section.start,
// //         section.end,
// //         section.generator()
// //       );
// //     }

// //     return content;
// //   }

// //   private replaceSection(
// //     content: string,
// //     startMarker: string,
// //     endMarker: string,
// //     newContent: string
// //   ): string {
// //     const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
// //     const replacement = `${startMarker}\n  ${newContent}\n  // ${endMarker}`;
// //     return content.replace(regex, replacement);
// //   }
// // }


// // где-нибудь в общем файле типов
// export interface GenerationContext {
//   projectName: string;
//   model?: ServerpodModel;     // Для генераторов, работающих с одной сущностью
//   models?: ServerpodModel[];    // Для генераторов-агрегаторов, как для AppDatabase
//   featureName?: string;       // Любые другие данные, которые могут понадобиться
//   // ...и т.д.
// }

// // Конфигурация секций остается такой же
// export interface Section {
//   start: string;
//   end: string;
//   // Генератор теперь принимает контекст, чтобы получить нужные ему данные
//   generator: (context: GenerationContext) => string;
// }

// export class UniversalPatternProcessor {
//   process(
//     content: string,
//     context: GenerationContext, // <-- Принимает один объект контекста
//     sections: Section[]
//   ): string {
//     let newContent = content;

//     // 1. Простая замена, если модель есть в контексте
//     if (context.model) {
//       newContent = new SimpleReplacementProcessor().process(newContent, context.model, context.projectName);
//     }

//     // 2. Замена секций
//     newContent = this.replaceSections(newContent, context, sections);

//     return newContent;
//   }

//   private replaceSections(
//     content: string,
//     context: GenerationContext,
//     sections: Section[]
//   ): string {
//     for (const section of sections) {
//       // Вызываем генератор секции и ПЕРЕДАЕМ ему ВЕСЬ контекст
//       const generatedSectionContent = section.generator(context);

//       content = this.replaceSection(
//         content,
//         section.start,
//         section.end,
//         generatedSectionContent
//       );
//     }
//     return content;
//   }

//   private replaceSection(
//     content: string,
//     startMarker: string,
//     endMarker: string,
//     newContent: string
//   ): string {
//     const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
//     const replacement = `${startMarker}\n  ${newContent}\n  // ${endMarker}`;
//     return content.replace(regex, replacement);
//   }
// }