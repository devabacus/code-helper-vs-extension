import path from "path";
import { navigationService, navigationServiceProviderDart, navigationServiceProviderGenDart, routerConfigGenerator, routerContent, routesContent } from "./files_content/files_contents";
import { appFile, mainFile } from "./files_content/root_files";

export const baseTemplateFolders = [
    'core/routing',
    'core/config',
    'core/providers',
    'core/services',
    'core/theme',
    'core/utils',
];

export const templatefiles: Record<string, string> = {
    'core/routing/routes_constants.dart': routesContent,
    'core/routing/router_config.g.dart': routerConfigGenerator,
    'core/services/navigation_service.dart': navigationService,
    'core/providers/navigation_provider.dart': navigationServiceProviderDart,
    'core/providers/navigation_provider.g.dart': navigationServiceProviderGenDart,
    'main.dart': mainFile,
    'app.dart': appFile,
};

export const appRouterConfigPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const appRouterNavServicePath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

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

export const featureFilesPaths = [
    // 'presentation/routing/router_config.dart',
    // feautureRouterPath(),
];


export const feautureRouterPath = (featureName: string) => [
    `presentation/routing/${featureName}_router.dart`,
];
