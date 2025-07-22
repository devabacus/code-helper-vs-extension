import path from "path";
import { IFileSystem } from "../../../core/interfaces/file_system";
import { ProjectConfig } from "../project_config";
import { FileListAggregator } from "../files/file_list_agreggator";
import { DefaultFileSystem } from "../../../core/implementations/default_file_system";


export class FlutterStaticFileGenerator {

    private fileSystem: IFileSystem;

    constructor(
        private genConf: ProjectConfig,
        fileSystem?: IFileSystem,
    ) {
        this.fileSystem = fileSystem || new DefaultFileSystem();
    }
    public async generate(): Promise<void> {

        const fileAggregator = new FileListAggregator();
        const relPaths = fileAggregator.allFlutterStaticFiles;

        const copyPromises = relPaths.map(relPath => {

            const sourcePath = path.join(this.genConf.templFlutterProjectPath, relPath);
            const destPath = path.join(this.genConf.targetFlutterProjectPath, relPath);
            return this.fileSystem.copyFile(sourcePath, destPath);
        });
        await Promise.all(copyPromises);
    }
}
