
export interface IDataStructure {

    get daoPath(): string;
    get repositoryPath(): string;
    get modelPath(): string;
    get tablePath(): string;
    get tableExtension(): string;
    get localPath(): string;
    get localDataSourcePath(): string;
    get providerPath(): string;
    get modelExtensionPath(): string;
    get localInterfacesPath(): string;
    get remoteInterfacesPath(): string;
    get sourceRemotePath(): string;
}