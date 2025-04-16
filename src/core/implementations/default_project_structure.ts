import path from "path";
import { ProjectStructure } from "../interfaces/project_structure";


export class DefaultProjectStructure implements ProjectStructure {


    data: string = "data";
    dao: string = "dao";
    local: string = "local";
    models: string = "models";
    dataSources: string = "datasources";
    sources: string = "sources";
    tables: string = "tables";


    domain: string = "domain";
    usecases: string = "usecases";
    entities: string = "entities";

    presentation: string = "presentation";

    repository: string = "repositories";

    providers: string = "providers";

    extensions: string = "extensions";

    interfaces: string = "interfaces";




    // data 

    getDaoPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.dataSources, this.local, this.dao);
    }

    getLocalDataSourcePath(featurePath: string): string {
        return path.join(featurePath, this.data, this.dataSources, this.local, this.sources);
    }

    getTableExtension(featurePath: string): string {
        return path.join(featurePath, this.data, this.dataSources, this.local, this.tables, this.extensions);
    }

    getDataModelPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.models);
    }


    getDataRepositoryPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.repository);
    }


    getDataProvderPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.providers);
    }

    getDataExtensionPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.models, this.extensions);
    }

    getDataLocalInterfacesPath(featurePath: string): string {
        return path.join(featurePath, this.data, this.dataSources, this.local, this.interfaces);
    }

    // domain     
    getEntityPath(featurePath: string): string {
        return path.join(featurePath, this.domain, this.entities);
    }

    getDomainRepositoryPath(featurePath: string): string {
        return path.join(featurePath, this.domain, this.repository);
    }
    getDomainUseCaseProviderPath(featurePath: string): string {
        return path.join(featurePath, this.domain, this.providers);
    }
    getDomainUseCasesPath(featurePath: string): string {
        return path.join(featurePath, this.domain, this.usecases);
    }

    getDomainExtensionPath(featurePath: string): string {
        return path.join(featurePath, this.domain, this.entities, this.extensions);
    }

    // presentation 
    getPresentationPath(featurePath: string): string {
        return path.join(featurePath, this.presentation);
    }
    getPresentationProviderPath(featurePath: string): string {
        return path.join(featurePath, this.presentation, this.providers);
    }








}
