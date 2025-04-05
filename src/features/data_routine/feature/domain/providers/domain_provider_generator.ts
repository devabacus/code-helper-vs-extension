import { IFileSystem } from "../../../../../core/interfaces/file_system";
import { ProviderGenerator } from "../../../provider_files_generator";
import { usecaseProvCont, useCaseProvPath } from "./use_case_prov";


export class DomainProviderGenerator implements ProviderGenerator {
    constructor(private fileSystem: IFileSystem) { }

    async generate(featurePath: string, driftClassName: string): Promise<void> {
        const _useCaseProvPath = useCaseProvPath(featurePath, driftClassName);
        const _usecaseProvCont = usecaseProvCont(driftClassName);
        await this.fileSystem.createFile(_useCaseProvPath, _usecaseProvCont);
    }
}