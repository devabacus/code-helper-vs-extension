import { routerConfigGenerator, routerContent, routesContent } from "./files_content/routers_contents";
import { appFile, mainFile } from "./root_files";

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
    'core/routing/router_config.dart': routerContent,
    'core/routing/router_config.g.dart': routerConfigGenerator,
    'main.dart': mainFile,
    'app.dart': appFile,
};


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
  