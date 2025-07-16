import path from "path";
import { IDataStructure } from "../interfaces/i_data_structure";
import { ARCH_NAMES as c } from "../constants/structure_constants";
import { IDomainStructure } from "../interfaces/i_domain_structure";

export class DomainStructure implements IDomainStructure {

    private basePath: string;

    constructor(featPath: string){
        this.basePath = featPath;
    }

    getEntityPath(): string {
        return path.join(this.basePath, c.DOMAIN, c.ENTITIES);
    }

    getDomainRepositoryPath(): string {
        return path.join(this.basePath, c.DOMAIN, c.REPOSITORIES);
    }
    getDomainUseCaseProviderPath(): string {
        return path.join(this.basePath, c.DOMAIN, c.PROVIDERS);
    }
    getDomainUseCasesPath(): string {
        return path.join(this.basePath, c.DOMAIN, c.USECASES);
    }

    getDomainExtensionPath(): string {
        return path.join(this.basePath, c.DOMAIN, c.ENTITIES, c.EXTENSIONS);
    }
}