import { FileSystem } from "../../core/interfaces/file_system";
import { dataProvCont, dataProvPath } from "./feature/data/providers/data_layer_prov";
import { usecaseProvCont, useCaseProvPath } from "./feature/domain/providers/use_case_prov";
import { presentProvFoldPath, presentProvPath, presentStateProvCont } from "./feature/presentation/providers/present_state_prov";



export class ProviderFileGenerator {

    constructor(private fileSystem: FileSystem) { }

    async addProviderFiles(featurePath: string, driftClassName: string) {

        const newTableFolderP = presentProvFoldPath(featurePath, driftClassName);
        await this.fileSystem.createFolder(newTableFolderP);

        const _presentProvPath = presentProvPath(newTableFolderP, driftClassName);
        const _presentStateProvCont = presentStateProvCont(driftClassName);
        await this.fileSystem.createFile(_presentProvPath, _presentStateProvCont);

        const _dataProvPath = dataProvPath(featurePath, driftClassName);
        const _dataProvCont = dataProvCont(driftClassName);
        await this.fileSystem.createFile(_dataProvPath, _dataProvCont);

        const _useCaseProvPath = useCaseProvPath(featurePath, driftClassName);
        const _usecaseProvCont = usecaseProvCont(driftClassName);
        await this.fileSystem.createFile(_useCaseProvPath, _usecaseProvCont);
    }
}

import { DefaultFileSystem } from "../../core/implementations/default_file_system";

export async function addProviderFiles(featurePath: string, driftClassName: string) {
    const fileSystem = new DefaultFileSystem()
    const generator = new ProviderFileGenerator(fileSystem);
    generator.addProviderFiles(featurePath, driftClassName);
}






