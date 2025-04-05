
export interface ProjectStructure{
    
    daoPath: string;
    dataPath: string;
    dataSourcesPath: string;
    sourcesPath: string;
    localPath: string;
    modelsPath: string;
    
    domainPath: string;
    usecasesPath: string;
    entitiesPath: string;

    extensionsPath: string;

    presentationPath: string;

    repositoryPath: string;

    providersPath: string;

    getDataRepositoryPath(featurePath: string): string;
    getDataModelPath(featurePath: string): string;
    getDaoPath(featurePath: string): string;
    getLocalDataSourcePath(featurePath: string): string;
    getDataProvderPath(featurePath: string): string;
    getDataExtensionPath(featurePath: string): string;

    
    getEntityPath(featurePath: string): string;
    getDomainRepositoryPath(featurePath: string): string;
    getDomainUseCaseProviderPath(featurePath: string): string;
    getDomainExtensionPath(featurePath: string): string;
    
    getDomainUseCasesPath(featurePath: string): string;
   
    getPresentationPath(featurePath: string): string;
    getPresentationProviderPath(featurePath: string): string;
}


