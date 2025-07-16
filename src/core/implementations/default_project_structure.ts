import path from "path";
import { IProjectStructureLegacy } from "../interfaces/project_structure";


export class DefaultProjectStructureLegacy implements IProjectStructureLegacy {

    data: string = "data";
    dao: string = "dao";
    local: string = "local";
    models: string = "models";
    dataSources: string = "datasources";
    sources: string = "sources";
    tables: string = "tables";
    remote: string = "remote";

    domain: string = "domain";
    usecases: string = "usecases";
    entities: string = "entities";

    presentation: string = "presentation";

    repository: string = "repositories";

    providers: string = "providers";

    extensions: string = "extensions";

    interfaces: string = "interfaces";

    // data 
    private getLocalPath(featPath: string): string {
        return path.join(featPath, this.data, this.dataSources, this.local);
    }

    getLocalTablePath(featPath: string): string {
        return path.join(featPath, this.data, this.dataSources, this.local, this.tables);
    }

    getDaoPath(featPath: string): string { return path.join(this.getLocalPath(featPath), this.dao); }
    getDataLocalInterfacesPath(featPath: string): string {
        return path.join(this.getLocalPath(featPath), this.interfaces);
    }
    getLocalDataSourcePath(featPath: string): string {
        return path.join(this.getLocalPath(featPath), this.sources);
    }

    getDataRemoteInterfacesPath(featPath: string): string {
        return path.join(featPath, this.data, this.dataSources, this.remote, this.interfaces);
    }

    getDataSourceRemotePath(featPath: string): string {
        return path.join(featPath, this.data, this.dataSources, this.remote, this.sources);
    }

    getTablePath(featPath: string): string { return this.getLocalTablePath(featPath); }

    getTableExtension(featPath: string): string { return this.getLocalTablePath(this.extensions); }

    getDataModelPath(featPath: string): string {
        return path.join(featPath, this.data, this.models);
    }


    getDataRepositoryPath(featPath: string): string {
        return path.join(featPath, this.data, this.repository);
    }


    getDataProvderPath(featPath: string): string {
        return path.join(featPath, this.data, this.providers);
    }

    getDataExtensionPath(featPath: string): string {
        return path.join(featPath, this.data, this.models, this.extensions);
    }





    // domain     
    getEntityPath(featPath: string): string {
        return path.join(featPath, this.domain, this.entities);
    }

    getDomainRepositoryPath(featPath: string): string {
        return path.join(featPath, this.domain, this.repository);
    }
    getDomainUseCaseProviderPath(featPath: string): string {
        return path.join(featPath, this.domain, this.providers);
    }
    getDomainUseCasesPath(featPath: string): string {
        return path.join(featPath, this.domain, this.usecases);
    }

    getDomainExtensionPath(featPath: string): string {
        return path.join(featPath, this.domain, this.entities, this.extensions);
    }

    // presentation 
    getPresentationPath(featPath: string): string {
        return path.join(featPath, this.presentation);
    }
    getPresentationProviderPath(featPath: string): string {
        return path.join(featPath, this.presentation, this.providers);
    }








}
