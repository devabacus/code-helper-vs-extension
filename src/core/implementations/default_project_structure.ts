import path from "path";
import { ProjectStructure } from "../interfaces/project_structure";


export class DefaultProjectStructure implements ProjectStructure {
    
    dataPath: string = "data";
    daoPath: string = "dao";
    localPath: string = "local";
    modelsPath: string = "models";
    dataSourcesPath: string = "datasources";
    sourcesPath: string = "sources";
    
    domainPath: string = "domain";
    entitiesPath: string = "entities";
    
    presentationPath: string = "presentation";
    
    repositoryPath: string = "repositories";
    
    providersPath: string = "providers";
    
    // data 

    getDaoPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.dataSourcesPath, this.localPath, this.daoPath);
    }

    getLocalDataSourcePath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.dataSourcesPath, this.localPath, this.sourcesPath);
    }


    getDataModelPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.modelsPath);
    }
    

    getDataRepositoryPath(featurePath: string):string {
        return path.join(featurePath, this.dataPath, this.repositoryPath);
    }
      

    getDataProvderPath(featurePath: string):string{
        return path.join(featurePath, this.dataPath, this.providersPath);
    }


    // domain     
    getEntityPath(featurePath: string):string {
        return path.join(featurePath, this.domainPath, this.entitiesPath);
    }

    getDomainRepositoryPath(featurePath: string):string {
        return path.join(featurePath, this.domainPath, this.repositoryPath);
    }
    getDomainUseCaseProviderPath(featurePath: string):string {
        return path.join(featurePath, this.domainPath, this.providersPath);
    }

   
    // presentation 
    getPresentationPath(featurePath: string):string {
        return path.join(featurePath, this.presentationPath);
    }
    getPresentationProviderPath(featurePath: string):string {
        return path.join(featurePath, this.presentationPath, this.providersPath);
    }

    

   




}
