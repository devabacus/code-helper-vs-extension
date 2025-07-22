import path from "path";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { CodeFormatter } from "../../data_routine/serverpod_yaml_parser/formatters/code_formatter";
import { ServerpodModel } from "../../data_routine/serverpod_yaml_parser/formatters/types";
import { ProjectConfig } from "../project_config";
import { ContentProcessor, SimpleReplacementProcessor } from "../content_processor";
import { PATTERN_FILES } from "../files/pattern_files";
import { SIMPLE_FILES } from "../files/simple_files";

// Все файлы для генерации
const ALL_FILES = [...SIMPLE_FILES, ...PATTERN_FILES];

export class UniversalFileGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private codeFormatter: CodeFormatter,
    private genConf: ProjectConfig
  ) { }

  async generateAll(
    model: ServerpodModel
  ): Promise<void> {
    const filesToGenerate = this.getFilesForModel(model);

    for (const filePath of filesToGenerate) {
      await this.generateFile(filePath, this.genConf.sourceFeaturePath, this.genConf.getFeaturePath, model);
    }
  }

  private getFilesForModel(model: ServerpodModel): string[] {
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
    filePath: string,
    sourceProjectPath: string,
    targetProjectPath: string,
    model: ServerpodModel
  ): Promise<void> {
    // Читаем шаблон
    const sourcePath = path.join(sourceProjectPath, filePath);
    const sourceContent = await this.fileSystem.readFile(sourcePath);
    const targetProjectName = this.getTargetProjectName(targetProjectPath);

    // Обрабатываем контент
    const processor = this.getProcessor(filePath);
    const newContent = processor.process(sourceContent, model, targetProjectName);

    // Создаем новый файл
    const newRelativePath = this.replacePathEntity(filePath, model.className);
    const targetPath = path.join(targetProjectPath, newRelativePath);
    await this.fileSystem.createFile(targetPath, newContent);
  }

  private getProcessor(filePath: string): ContentProcessor {

    if (SIMPLE_FILES.includes(filePath)) {
      return new SimpleReplacementProcessor();
    } else {
      return new SimpleReplacementProcessor();
      //заглушка
      // return new PatternBasedProcessor(this.codeFormatter);
    }
  }

  private getTargetProjectName(targetPath: string): string {
    const serverPath = targetPath.split(/\w*_server/)[0];
    return path.basename(serverPath);
  }

  private replacePathEntity(path: string, newEntity: string): string {
    return path.replace(/category/g, newEntity.toLowerCase());
  }
}