import path from "path";
import { navServProv, routesCont } from '../../add_feature/files';

import { navServ } from "../../add_feature/files/nav_service";
import { flutter_handle_ps1 } from "../service_files/flutter_handle_ps1";
import { git_handle_ps1 } from "../service_files/git_handle_ps1";
import { menv } from "../service_files/m_env";
import { api_provider } from "./add_chopper/files/providers/api_providers";
import { api_client } from "./add_chopper/files/services/api/api_client";
import { appFile } from "./files_content/app_file";
import { config_dart } from "./files_content/config/config_dart";
import { mainFile } from "./files_content/main_file";

export const baseTemplateFolders = [
    'core/routing',
    'core/config',
    'core/database/local/provider',
    'core/database/local/tables',
    'core/database/local/daos',
    'core/providers',
    'core/services',
    // 'core/services/interceptors/error_interceptor',
    'core/services/api',
    'core/theme',
    'core/utils',
];

export const templatefiles: Record<string, string> = {
    'core/routing/routes_constants.dart': routesCont,
    'core/services/navigation_service.dart': navServ,
    'core/providers/navigation_provider.dart': navServProv,
    
    'core/config/config.dart': config_dart,
    // chopper
    'core/services/api/api_client.dart':api_client,
    // 'core/services/interceptors/bearer_token_interceptor.dart':bearer_token_interceptor,
    // 'core/services/interceptors/cache_interceptor.dart':cache_interceptor,
    // 'core/services/interceptors/retry_interceptor.dart':retry_interceptor,
    // 'core/services/interceptors/x_api_key_interceptor.dart':x_api_key_interceptor,
    // 'core/services/interceptors/def_headers_Interceptor.dart': def_headers_interceptor,

    // 'core/services/interceptors/error_interceptor/api_exception.dart':api_exception,
    // 'core/services/interceptors/error_interceptor/error_interceptor.dart':error_interceptor,

    'core/providers/api_provider.dart': api_provider,

    'main.dart': mainFile,
    'app.dart': appFile,
};


type FuncAnyArgs<T> = (...args: string[]) => T

export const projectFiles: Record<string, string> = {

    '.env': menv,
    '_service_files/flutter_handle.ps1': flutter_handle_ps1,
    '_service_files/git_handle.ps1': git_handle_ps1,
    '_service_files/shell_commands.ps1': "",
};


export const routerPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const routerNavServPath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

