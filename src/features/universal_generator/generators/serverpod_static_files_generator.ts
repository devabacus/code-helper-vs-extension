import path from "path";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { ProjectConfig } from "../project_config";
import { FileListAggregator } from "../files/file_list_agreggator";
import { DefaultFileSystem } from "../../../core/implementations/default_file_system";


// Новый файл: serverpod_static_generator.ts
export class ServerpodStaticGenerator {

    private fileSystem: IFileSystem;

    constructor(
        private genConf: ProjectConfig,
        fileSystem?: IFileSystem,
    ) {
        this.fileSystem = fileSystem || new DefaultFileSystem();
    }

    public async generate(): Promise<void> {
        const fileAggregator = new FileListAggregator();
        const relPaths = fileAggregator.getStaticServerpodFiles();

        for (const relPath of relPaths) {
            const sourcePath = path.join(this.genConf.templServerProjectPath, relPath);
            // Генератор сам знает, какой базовый путь использовать
            const destPath = path.join(this.genConf.targetServerProjectPath, relPath);
            await this.fileSystem.copyFile(sourcePath, destPath);
        }
    }
}