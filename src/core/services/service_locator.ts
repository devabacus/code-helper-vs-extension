import { ProviderFilesGenerator } from "../../features/data_routine/provider_files_generator";
import { DefaultFileSystem } from "../implementations/default_file_system";
import { IFileSystem } from "../interfaces/file_system";



export class ServiceLocator {

    private static instance: ServiceLocator;
    private services: Map<string, any> = new Map();

    private constructor() {
        // здесь стандартные сервисы
        this.registerFileSystem(new DefaultFileSystem);
    }

    static getInstance(): ServiceLocator {
        if (!ServiceLocator.instance) {
            ServiceLocator.instance = new ServiceLocator();
        }
        return ServiceLocator.instance;
    }

    registerFileSystem(fileSystem: IFileSystem): void {
        this.services.set("fileSystem", fileSystem);
    }

    getFileSystem(): IFileSystem {
        return this.services.get("fileSystem");
    }

    getProviderFilesGenerator(): ProviderFilesGenerator {
        const fileSystem = this.getFileSystem();
        return new ProviderFilesGenerator(fileSystem);
    }
}