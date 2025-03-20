import path from "path";
import { navigationService, navigationServiceProviderDart, navigationServiceProviderGenDart, routerConfigGenerator, routesContent } from "./files_content/files_contents";
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

export const routerPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const routerNavServPath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

