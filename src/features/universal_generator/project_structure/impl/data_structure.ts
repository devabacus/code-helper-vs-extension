import path from "path";
import { IDataStructure } from "../interfaces/i_data_structure";
import { ARCH_NAMES as c } from "../constants/structure_constants";

export class DataStructure implements IDataStructure {

    private basePath: string;

    constructor(featPath: string) {
        this.basePath = featPath;
    }

    get localPath(): string {
        return path.join(this.basePath, c.DATA, c.DATASOURCES, c.LOCAL);
    }

    // dao, datasources
    get daoPath(): string {
        return path.join(this.localPath, c.DAO);
    }

    get localInterfacesPath(): string {
        return path.join(this.localPath, c.INTERFACES);
    }

    get localDataSourcePath(): string {
        return path.join(this.localPath, c.DATASOURCES);
    }

    get remoteInterfacesPath(): string {
        return path.join(this.basePath, c.DATA, c.DATASOURCES, c.REMOTE, c.INTERFACES);
    }

    get sourceRemotePath(): string {
        return path.join(this.basePath, c.DATA, c.DATASOURCES, c.REMOTE, c.DATASOURCES);
    }

    // tables
    get tablePath(): string {
        return path.join(this.basePath, c.DATA, c.DATASOURCES, c.LOCAL, c.TABLES);
    }

    get tableExtension(): string {
        return path.join(this.tablePath, c.EXTENSIONS);
    }

    // models
    get modelPath(): string {
        return path.join(this.basePath, c.DATA, c.MODELS);
    }

    get modelExtensionPath(): string {
        return path.join(this.basePath, c.DATA, c.MODELS, c.EXTENSIONS);
    }

    // repositories, providers
    get repositoryPath(): string {
        return path.join(this.basePath, c.DATA, c.REPOSITORIES);
    }

    get providerPath(): string {
        return path.join(this.basePath, c.DATA, c.PROVIDERS);
    }
}