import path from "path";
import { navServProvGen } from "../navigation_files/constants/nav_service_prov_get";
import { appFile, mainFile } from "./files_content/root_files";
import { routerGen } from "../navigation_files/constants/router_gen";
import { routesCont } from "../navigation_files/constants/routes_consts";
import { navServ } from "../navigation_files/nav_service";
import { navServProv } from "../navigation_files/constants/nav_service_prov";

export const baseTemplateFolders = [
    'core/routing',
    'core/config',
    'core/providers',
    'core/services',
    'core/theme',
    'core/utils',
];

export const templatefiles: Record<string, string> = {
    'core/routing/routes_constants.dart': routesCont,
    'core/routing/router_config.g.dart': routerGen,
    'core/services/navigation_service.dart': navServ,
    'core/providers/navigation_provider.dart': navServProv,
    'core/providers/navigation_provider.g.dart': navServProvGen,
    'main.dart': mainFile,
    'app.dart': appFile,
};

export const routerPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const routerNavServPath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

