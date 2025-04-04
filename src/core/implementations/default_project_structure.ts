import path from "path";
import { ProjectStructure } from "../interfaces/project_structure";


export class DefaultProjectStructure implements ProjectStructure {
    dataPath: string = "data";
    domainPath: string = "domain";
    presentationPath: string = "presentation";
    entitiesPath: string = "entities";
    repositoryPath: string = "repositories";
    modelsPath: string = "models";
    dataSourcesPath: string = "datasources";
    sourcesPath: string = "sources";
    localPath: string = "local";
    daoPath: string = "dao";
    
    
    getEntityPath(featurePath: string):string {
        return path.join(featurePath, this.domainPath, this.entitiesPath);
    }

    getDomainRepositoryPath(featurePath: string):string {
        return path.join(featurePath, this.domainPath, this.repositoryPath);
    }

    getDataRepositoryPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.repositoryPath);
    }

    getPresentationPath(featurePath: string):string {
        return path.join(featurePath, this.presentationPath);
    }

    getDataModelPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.modelsPath);
    }

    getLocalDataSourcePath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.dataSourcesPath, this.localPath, this.sourcesPath);
    }

    getDaoPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.dataSourcesPath, this.localPath, this.daoPath);
    }


}
