
export interface ProjectStructure{
    dataPath: string;
    domainPath: string;
    presentationPath: string;
    entitiesPath: string;
    repositoryPath: string;
    modelsPath: string;
    dataSourcesPath: string;
    sourcesPath: string;
    localPath: string;
    daoPath: string;

    getEntityPath(featurePath: string): string;
    getDomainRepositoryPath(featurePath: string): string;
    getDataRepositoryPath(featurePath: string): string;
    getPresentationPath(featurePath: string): string;
    getDataModelPath(featurePath: string): string;
    getLocalDataSourcePath(featurePath: string): string;
    getDaoPath(featurePath: string): string;
}


