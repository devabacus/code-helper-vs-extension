import { FileSystem } from "../../../../../core/interfaces/file_system";
import { ProviderGenerator } from "../../../provider_files_generator";
import { presentProvFoldPath, presentProvPath, presentStateProvCont } from "./present_state_prov";


export class PresentationProviderGenerator implements ProviderGenerator {
    constructor(private fileSystem: FileSystem) { }

    async generate(featurePath: string, driftClassName: string): Promise<void> {
        const newTableFolderP = presentProvFoldPath(featurePath, driftClassName);
        await this.fileSystem.createFolder(newTableFolderP);
        const _presentProvPath = presentProvPath(newTableFolderP, driftClassName);
        const _presentStateProvCont = presentStateProvCont(driftClassName);
        await this.fileSystem.createFile(_presentProvPath, _presentStateProvCont);
    }
}