import path from "path";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { GeneratorConfig } from "../generator_config";
import { STATIC_FILES } from "../files/static_files";
import { PROJECT_CONFIG_FILES } from "../files/project_config_files";


export class ProjectConfGenerator {
    constructor(
        private fileSystem: IFileSystem,
        private genConf: GeneratorConfig
    ) {

    }
    public async generate(): Promise<void> {
        const replacements = {
            [this.genConf.templProject]: this.genConf.targetProject,
            // можно добавить другие замены уровня проекта, например, имя автора
        };

        for (const filePath of PROJECT_CONFIG_FILES) {
            const sourceFile = path.join(this.genConf.projectsPath, filePath);
            let content = await this.fileSystem.readFile(sourceFile);

            for (const [placeholder, value] of Object.entries(replacements)) {
                content = content.replaceAll(placeholder, value);
            }

            const _destPath = filePath.replaceAll(this.genConf.templProject, this.genConf.targetProject);

            const destFile = path.join(this.genConf.projectsPath, _destPath);
            await this.fileSystem.createFile(destFile, content);
        }
    }
}
