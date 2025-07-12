import path from "path";
import { IFileSystem } from "../../core/interfaces/file_system";
import { GeneratorConfig } from "./file_registry";
import { STATIC_FILES } from "./static_files";


export class StaticFileGenerator {
    constructor(
        private fileSystem: IFileSystem,
        private genConf: GeneratorConfig
    ) {
       
    }
     public async generate(): Promise<void> {
        console.log('Начинаю копирование статичных файлов...');

        const copyPromises = STATIC_FILES.map(sourcePath => {
            const _sourcePath = path.join(this.genConf.projectsPath, sourcePath);
            const destPath = _sourcePath.replaceAll('t2', this.genConf.projectName);
            return this.fileSystem.copyFile(_sourcePath, destPath);
        });
        await Promise.all(copyPromises);
        console.log('Копирование статичных файлов завершено.');
    }

}
