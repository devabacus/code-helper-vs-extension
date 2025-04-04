import { FileSystem } from "../../core/interfaces/file_system";



export interface ProviderGenerator {
    generate(featurePath: string, driftClassName: string): Promise<void>;
}

// Компоновщик для использования всех генераторов
export class ProviderFilesGenerator {
    private generators: ProviderGenerator[];

    constructor(fileSystem: FileSystem) {
        this.generators = [
            new DataProviderGenerator(fileSystem),
            new DomainProviderGenerator(fileSystem),
            new PresentationProviderGenerator(fileSystem)
        ];
    }

    async addProviderFiles(featurePath: string, driftClassName: string): Promise<void> {
        for (const generator of this.generators) {
            await generator.generate(featurePath, driftClassName);
        }
    }
}

import { DefaultFileSystem } from "../../core/implementations/default_file_system";
import { DataProviderGenerator } from "./feature/data/providers/data_provider_generator";
import { DomainProviderGenerator } from "./feature/domain/providers/domain_provider_generator";
import { PresentationProviderGenerator } from "./feature/presentation/providers/presentation_provider_generator";

export async function addProviderFiles(featurePath: string, driftClassName: string) {
    const fileSystem = new DefaultFileSystem();
    
    const generator = new ProviderFilesGenerator(fileSystem);
    generator.addProviderFiles(featurePath, driftClassName);
}






