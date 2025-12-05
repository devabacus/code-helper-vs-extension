import * as path from "path";
import { createFile, createFileOneTime, createFolder } from "../../utils";
import { executeCommand, executeInTerminal } from "../../utils/terminal_handle";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";
import { getUserInput, pickPath } from "../../utils/ui/ui_ask_folder";
import { gitInit } from "../git_init";
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
import { serverFile } from "../serverpod/generators/server_dart_file";
import { serverpodK8sFileGenerate } from "../serverpod/create_k8s_serverpod_files";
import { server_pubspec_yaml_file } from "../serverpod/generators/server_pubspec_yaml";
import { SERVERPOD_GENERATE } from "../serverpod/commands";
import { testDataSpy } from "../serverpod/server_test/test_data_spy";
import { testDataEndpoint } from "../serverpod/server_test/test_data_endpoint";
import { GenerationConfig } from "./paths/generation_config";
import { DefaultFileSystem } from "../../core/implementations/default_file_system";
import { ServiceLocator } from "../../core/services/service_locator";
import { GenerationService } from "./generators/generation_service";
import { AppDatabaseGenerator } from "./generators/app_database/app_database_generator";

export async function createNewProject(): Promise<void> {

    // Это нужно для тестов для реальной генерации всегда используеться DefaultFileSystem
    const fileSystem = ServiceLocator.getInstance().getFileSystem();

    // сохраняем название проекта, далее будет использоваться для генерации
    const targetProject = await getUserInput('введите название проекта');
    if (!targetProject) {
        return;
    }

    const config = new GenerationConfig({
        templProject: 't36',
        targetProject: targetProject,
        manifest: ['startProject']
    });

    
    await executeCommand(`serverpod create ${targetProject}`, config.projectsPath);
    const monoRepoPath = config.monoRepoTargetPath;

    await executeCommand(`flutter create ${targetProject}_admin`, monoRepoPath);

    const generationService = new GenerationService(fileSystem);
    await generationService.generate(config);

    const appDatabaseGenerator = new AppDatabaseGenerator(fileSystem, config);
    await appDatabaseGenerator.generate();

    startAppFix(config.targetFlutterProjectPath);
    gitInit(monoRepoPath);

    // const homePagePath = path.join(genConfig.targetFlutterProjectPath, 'lib', 'features', 'home', 'presentation', 'pages', 'home_page.dart');
    const openCommand = `antigravity -g "${monoRepoPath}"`;

    await executeCommand(pubGet, config.targetFlutterProjectPath);
    await executeCommand(pubGet, config.targetServerProjectPath);
    await executeCommand(pubGet, config.targetAdminProjectPath);

    await executeCommand(SERVERPOD_GENERATE, config.targetServerProjectPath);
    await executeCommand(build_runner, config.targetFlutterProjectPath);
    await executeCommand(build_runner, config.targetAdminProjectPath);
    // gitInit(monoRepoPath);
    await executeCommand(openCommand, config.projectsPath);
    // serverpodK8sFileGenerate(projectsPath);

}
