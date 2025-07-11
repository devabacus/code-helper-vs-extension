import path from "path";
import { IFileSystem } from "../../core/interfaces/file_system";
import { CodeFormatter } from "../data_routine/serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../data_routine/serverpod_yaml_parser/formatters/types";
import { ALL_FILES, FILE_REGISTRY, GeneratorConfig, SIMPLE_FILES } from "../data_routine/core/config/file_registry";
import { ContentProcessor, PatternBasedProcessor, SimpleReplacementProcessor } from "./content_processor";

export class UniversalFileGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private codeFormatter: CodeFormatter,
    private genConf: GeneratorConfig
  ) { }

  async generateAll(
    model: ServerpodModel
  ): Promise<void> {
    const filesToGenerate = this.getFilesForModel(model);

    for (const fileName of filesToGenerate) {
      await this.generateFile(fileName, this.genConf.sourceFeaturePath, this.genConf.getFeaturePath, model);
    }
  }

  private getFilesForModel(model: ServerpodModel): string[] {
    // Для обычных таблиц генерируем все файлы
    if (!model.isRelation) {
      // return ALL_FILES;
      return SIMPLE_FILES;      
    }

    // Для связующих таблиц - только нужные файлы
    return [
      'category_table.dart',
      'category_dao.dart',
      // ... файлы для связей
    ];
  }

  private async generateFile(
    fileName: string,
    sourceProjectPath: string,
    targetProjectPath: string,
    model: ServerpodModel
  ): Promise<void> {
    const relativePath = FILE_REGISTRY[fileName];

    // Читаем шаблон
    const sourcePath = path.join(sourceProjectPath, relativePath);
    const sourceContent = await this.fileSystem.readFile(sourcePath);
    const targetProjectName = this.getTargetProjectName(targetProjectPath);


    // Обрабатываем контент
    const processor = this.getProcessor(fileName);
    const newContent = processor.process(sourceContent, model, targetProjectName);

    // Создаем новый файл
    const newRelativePath = this.replacePathEntity(relativePath, model.className);
    const targetPath = path.join(targetProjectPath, newRelativePath);
    await this.fileSystem.createFile(targetPath, newContent);
  }

  private getProcessor(fileName: string): ContentProcessor {
    if (SIMPLE_FILES.includes(fileName)) {
      return new SimpleReplacementProcessor();
    } else {
      return new PatternBasedProcessor(this.codeFormatter);
    }
  }

private getTargetProjectName(targetPath: string): string{
  const serverPath = targetPath.split(/\w*_server/)[0];
  return path.basename(serverPath);
}

  private replacePathEntity(path: string, newEntity: string): string {
    return path.replace(/category/g, newEntity.toLowerCase());
  }
}