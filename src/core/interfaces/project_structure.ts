
export interface ProjectStructure {

    dao: string;
    data: string;
    dataSources: string;
    sources: string;
    local: string;
    tables: string;    
    models: string;
    interfaces: string;

    domain: string;
    usecases: string;
    entities: string;

    extensions: string;

    presentation: string;

    repository: string;

    providers: string;

    getDataRepositoryPath(featurePath: string): string;
    getDataModelPath(featurePath: string): string;
    getDaoPath(featurePath: string): string;
    getTableExtension(featurePath: string): string;
    getLocalDataSourcePath(featurePath: string): string;
    getDataProvderPath(featurePath: string): string;
    getDataExtensionPath(featurePath: string): string;
    getDataLocalInterfacesPath(featurePath: string): string;


    getEntityPath(featurePath: string): string;
    getDomainRepositoryPath(featurePath: string): string;
    getDomainUseCaseProviderPath(featurePath: string): string;
    getDomainExtensionPath(featurePath: string): string;

    getDomainUseCasesPath(featurePath: string): string;

    getPresentationPath(featurePath: string): string;
    getPresentationProviderPath(featurePath: string): string;
}


