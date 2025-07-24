import * as path from "path";
import { createFile, createFileOneTime, createFolder } from "../../utils";
import { executeCommand, executeInTerminal } from "../../utils/terminal_handle";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";
import { getUserInput, pickPath } from "../../utils/ui/ui_ask_folder";
import { gitInit } from "../git_init";
import { addDependecy } from "../template_project/add_pubspec/flutter_add_pubspec";
import { createRootTemplateFiles } from "../template_project/flutter_add_template_file";
import { pubspec_yaml } from "../template_project/flutter_content/files_content/pubspec_yaml";
import { startDependency } from "../template_project/flutter_content/package_pubscpec";
import { build_runner, pubGet } from "../template_project/flutter_content/terminal_commands";
import { startAppFix } from "../template_project/start_app_fix";
import { gitignoreCont } from "../template_project/flutter_content/files_content/_gitignore";
import { serverpodDataYaml } from "../serverpod/generators/server_data_yaml";
import { mainFile } from "../template_project/flutter_content/files_content/main_file";
import { serverCheckUi } from "../template_project/flutter_content/files_content/server_check_ui";
import { appFile } from "../template_project/flutter_content/files_content";
import { authWrapperFile } from "../template_project/flutter_content/files_content/auth_wrapper";
import { serverpodClientProviderFile } from "../data_routine/core/providers/serverpod_client_provider";
import { serverFile } from "../serverpod/generators/server_dart_file";
import { serverpodK8sFileGenerate } from "../serverpod/create_k8s_serverpod_files";
import { server_pubspec_yaml_file } from "../serverpod/generators/server_pubspec_yaml";
import { sync_registry_file } from "../data_routine/core/sync/sync_registry_file";
import { sync_controller_provider_file } from "../data_routine/core/sync/sync_controller_provider_file";
import { base_sync_repository } from "../data_routine/core/sync/base_sync_repository_file";
import { database_types_file } from "../data_routine/core/database/local/database_types_file";
import { SERVERPOD_GENERATE } from "../serverpod/commands";
import { testDataSpy } from "../serverpod/server_test/test_data_spy";
import { testDataEndpoint } from "../serverpod/server_test/test_data_endpoint";
import { GenerationConfig } from "./generation_config";
import { DefaultFileSystem } from "../../core/implementations/default_file_system";

export async function createNewProject(addTemplateFolders?: (fullProjectPath: string) => void): Promise<void> {

    // пользователь выбирает категории 
    const projectsPath = await pickPath();
    if (!projectsPath) {
        return;
    }
    const targetProject = await getUserInput('введите название проекта');
    if (!targetProject) {
        return;
    }

    await executeCommand(`serverpod create ${targetProject}`, projectsPath);

    const monoRepoPath = path.join(projectsPath, targetProject);

    const genConfig = new GenerationConfig({
        templProject: 't2',
        projectsPath: projectsPath,
        targetProject: targetProject,
    });


    // const staticFlutterGenerator = new FlutterStaticFileGenerator(genConfig);
    // await staticFlutterGenerator.generate();

    // const mainPath = path.join(flutterPath, "lib", "main.dart");
    // const serverCheckUilPath = path.join(flutterPath, "lib", "check", "server_check_ui.dart");
    // const authWrapperFilePath = path.join(flutterPath, "lib", "auth_wrapper.dart");
    // const appFilePath = path.join(flutterPath, "lib", "app.dart");


    // const serverpodClientProviderFilePath = path.join(flutterPath, "lib", "core", "providers", "serverpod_client_provider.dart");
    // const testDataSpyPath = path.join(serverPath, "lib", "src", "models", "test_data.spy.yaml");
    // const testDataEndPointPath = path.join(serverPath, "lib", "src", "endpoints", "test_data_endpoint.dart");

    // const serverFilePath = path.join(serverPath, "lib", "server.dart");

    // createFile(serverDataYamlPath, serverpodDataYaml(projectName));
    // createFile(mainPath, mainFile(projectName));

    // createFile(appFilePath, appFile);
    // createFile(authWrapperFilePath, authWrapperFile());
    // createFile(serverpodClientProviderFilePath, serverpodClientProviderFile(projectName));
    // createFile(serverFilePath, serverFile(projectName));
    // createFile(serverPubSpecYamlPath, server_pubspec_yaml_file(projectName));

    // createFile(testDataSpyPath, testDataSpy);
    // createFile(testDataEndPointPath, testDataEndpoint);


    // const databaseTypesPath = path.join(flutterPath, "lib", "core", "database", "local", "database_types.dart");
    // const syncRegistryPath = path.join(flutterPath, "lib", "core", "sync", "sync_registry.dart");
    // const syncControllerPath = path.join(flutterPath, "lib", "core", "sync", "sync_controller_provider.dart");

    // 'core/database/local/daos/sync_metadata_dao.dart': sync_metadata_dao_file,


    // createFileOneTime(syncRegistryPath, sync_registry_file);
    // createFileOneTime(syncControllerPath, sync_controller_provider_file);
    // const baseSyncRepositoryPath = path.join(flutterPath, "lib", "core", "sync", "base_sync_repository.dart");
    // createFileOneTime(baseSyncRepositoryPath, base_sync_repository);
    // createFileOneTime(databaseTypesPath, database_types_file);

    // createFile(serverCheckUilPath, serverCheckUi(projectName));


    if (addTemplateFolders) {
        addTemplateFolders(genConfig.targetFlutterProjectPath);
    }
    startAppFix(genConfig.targetFlutterProjectPath);

    // insertAtFileEnd(path.join(fullFlutterProjectPath, '.gitignore'), gitignoreCont);

    // const serviceFilesPth = path.join(fullFlutterProjectPath, "_service_files");
    // const vscodePth = path.join(fullFlutterProjectPath, ".vscode");
    // await createFolder(serviceFilesPth);
    // await createFolder(vscodePth);


    // createRootTemplateFiles(fullFlutterProjectPath);


    // createFile(path.join(fullFlutterProjectPath, "pubspec.yaml"), pubspec_yaml(projectName));

    gitInit(monoRepoPath);

    const homePagePath = path.join(genConfig.targetFlutterProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `code -g "${homePagePath}" "${monoRepoPath}"`;

    await executeCommand(pubGet, genConfig.targetFlutterProjectPath);
    await executeCommand(pubGet, genConfig.targetServerProjectPath);
    await executeCommand(build_runner, genConfig.targetFlutterProjectPath);
    await executeCommand(SERVERPOD_GENERATE, genConfig.targetServerProjectPath);
    gitInit(monoRepoPath);
    await executeCommand(openCommand, projectsPath);
    // serverpodK8sFileGenerate(projectsPath);

}
