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
        // features: ['startProject', 'serverpod', 'deploy']
    });

    if (addTemplateFolders) {
        addTemplateFolders(genConfig.targetFlutterProjectPath);
    }
    startAppFix(genConfig.targetFlutterProjectPath);

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
