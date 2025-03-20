import path from "path";
import {navServProv,navServProvGen,routerGen,routesCont} from '../navigation_files';
import { navServ } from "../navigation_files/nav_service";

import {} from '../navigation_files';
import { mainFile } from "./files_content/main_file";
import { appFile } from "./files_content/app_file";

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

