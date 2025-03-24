import path from "path";
import { navServProv, navServProvGen, routerGen, routesCont } from '../../add_feature/files';

import { flutter_handle_ps1 } from "../../service_files/flutter_handle_ps1";
import { git_handle_ps1 } from "../../service_files/git_handle_ps1";
import { appFile } from "./files_content/app_file";
import { mainFile } from "./files_content/main_file";
import { navServ } from "../../add_feature/files/nav_service";

export const baseTemplateFolders = [
    'core/routing',
    'core/config',
    'core/database',
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


type FuncAnyArgs<T> = (...args: string[]) => T

export const projectFiles: Record<string, string> = {
    'flutter_handle.ps1': flutter_handle_ps1,
    'git_handle.ps1': git_handle_ps1,
    'shell_commands.ps1': "",
};


export const routerPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const routerNavServPath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

