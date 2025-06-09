import path from "path";
import { navServProv, navServProvGen, routerGen, routesCont } from '../../add_feature/files';

import { flutter_handle_ps1 } from "../service_files/flutter_handle_ps1";
import { git_handle_ps1 } from "../service_files/git_handle_ps1";
import { appFile } from "./files_content/app_file";
import { mainFile } from "./files_content/main_file";
import { navServ } from "../../add_feature/files/nav_service";
import { config_dart } from "./files_content/config/config_dart";
import { api_client } from "./add_chopper/files/services/api/api_client";
import { bearer_token_interceptor } from "./add_chopper/files/interceptors/bearer_token_interceptor";
import { cache_interceptor } from "./add_chopper/files/interceptors/cache_interceptor";
import { retry_interceptor } from "./add_chopper/files/interceptors/retry_interceptor";
import { x_api_key_interceptor } from "./add_chopper/files/interceptors/x_api_key_interceptor";
import { api_exception } from "./add_chopper/files/interceptors/error_interceptors/api_exception";
import { error_interceptor } from "./add_chopper/files/interceptors/error_interceptors/error_interceptor";
import { api_provider } from "./add_chopper/files/providers/api_providers";
import { api_provider_g } from "./add_chopper/files/providers/api_provider.g";
import { menv } from "../service_files/m_env";
import { def_headers_interceptor } from "./add_chopper/files/interceptors/headers_Interceptor";
import { settingsJson } from "../service_files/settings_json";

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



    // 'main.dart': mainFile,
    'app.dart': appFile,
};


type FuncAnyArgs<T> = (...args: string[]) => T

export const projectFiles: Record<string, string> = {

    '.env': menv,
    '.vscode/settings.json': settingsJson,
    '_service_files/flutter_handle.ps1': flutter_handle_ps1,
    '_service_files/git_handle.ps1': git_handle_ps1,
    '_service_files/shell_commands.ps1': "",
};


export const routerPath = (rootPath: string) => path.join(rootPath, "lib", 'core/routing/router_config.dart');

export const routerNavServPath = (rootPath: string) => path.join(rootPath, "lib", 'core/services/navigation_service.dart');

