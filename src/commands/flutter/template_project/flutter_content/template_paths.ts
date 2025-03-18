import path from "path";
import { routerConfigGenerator, routerContent, routesContent } from "./files_content/files_contents";
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
    'main.dart': mainFile,
    'app.dart': appFile,
};

export const appRouterConfigPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

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
];

export const featureFilesPaths = [
    // 'presentation/routing/router_config.dart',
    // feautureRouterPath(),
];


export const feautureRouterPath = (featureName: string) => [
    `presentation/routing/${featureName}_router.dart`,
];
