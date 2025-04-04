import { FileSystem } from "../../../../../core/interfaces/file_system";
import { ProviderGenerator } from "../../../provider_files_generator";
import { dataProvCont, dataProvPath } from "./data_layer_prov_templ";


export class DataProviderGenerator implements ProviderGenerator {
    constructor(private fileSystem: FileSystem) { }

    async generate(featurePath: string, driftClassName: string): Promise<void> {
        const _dataProvPath = dataProvPath(featurePath, driftClassName);
        const _dataProvCont = dataProvCont(driftClassName);
        await this.fileSystem.createFile(_dataProvPath, _dataProvCont);
    }
}
