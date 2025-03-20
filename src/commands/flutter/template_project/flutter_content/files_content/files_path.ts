export const featureFolderPaths = [
    'data/models',
    'data/repositories',
    'data/datasources',
    'domain/entities',
    'domain/usecases',
    'presentation/pages',
    'presentation/widgets',
    'presentation/routing',
    'presentation/providers',
    'presentation/services',
];




export const featureNavServiceProviderPath = (featurePath: string, featureName: string) => `${featurePath}/presentation/providers/${featureName}_navigation_provider.dart`;

export const featureNavServiceProviderGenPath = (featurePath: string, featureName: string) => `${featurePath}/presentation/providers/${featureName}_navigation_provider.g.dart`;