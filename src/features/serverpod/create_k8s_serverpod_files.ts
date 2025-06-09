import path from "path";
import { ServiceLocator } from "../../core/services/service_locator";
import { createFile, executeCommand, readFile } from "../../utils";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";
import { DockerfileProdGeneratorLegacy } from "./generators/dockerfile_prod_generate";
import { EnvGenerator } from "./generators/env_generator";
import { ConfigMapGenerator } from "./k8s/configmap_generate";
import { parseServerDataYaml, ServerDataConfig } from "./server_yaml_parser";
import { DockerfileProdGenerator } from "./k8s/dockerfile_prod_generate";
import { DeploymentGenerator } from "./k8s/deployment_generator";
import { IngressGenerator } from "./k8s/ingress_generator";
import { JobGenerator } from "./k8s/job_generator";
import { ServiceGenerator } from "./k8s/service_generator";
import { SecretGenerator } from "./k8s/secret_generator";
import { mainFile } from "../template_project/flutter_content/files_content";
import { serverCheckUi } from "../template_project/flutter_content/files_content/server_check_ui";
import { testDataSpy } from "./server_test/test_data_spy";
import { testDataEndpoint } from "./server_test/test_data_endpoint";
import { dockerignore } from "./dockerignore";
import { SERVERPOD_GENERATE } from "./commands";
import { serverServiceFile } from "./server_service_file";


export async function serverpodK8sFileGenerate(projectPath: string): Promise<void> {
    const projectName = path.basename(projectPath);

    const serverPath = path.join(projectPath, `${projectName}_server`);
    const flutterPath = path.join(projectPath, `${projectName}_flutter`);

    const serverDataYamlPath = path.join(serverPath, "server_data.yaml");
    const dockerignorePath = path.join(serverPath, ".dockerignore");
    const serverHandleCmdsPath = path.join(serverPath, "_server_handle_files", "_server_commands.ps1");


    const serverYamlContent = await readFile(serverDataYamlPath);

    const serverYamlData: ServerDataConfig = parseServerDataYaml(serverYamlContent);
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();


    const mainPath = path.join(flutterPath, "lib", "main.dart");
    const serverCheckUilPath = path.join(flutterPath, "lib", "check", "server_check_ui.dart");
    const testDataSpyPath = path.join(serverPath, "lib", "src", "models", "test_data.spy.yaml");
    const testDataEndPointPath = path.join(serverPath, "lib", "src", "endpoints", "test_data_endpoint.dart");

    createFile(dockerignorePath, dockerignore);
    createFile(mainPath, mainFile(projectName));
    createFile(serverCheckUilPath, serverCheckUi(projectName));
    createFile(serverCheckUilPath, serverCheckUi(projectName));
    
    createFile(testDataSpyPath, testDataSpy);
    createFile(testDataEndPointPath, testDataEndpoint);
    createFile(serverHandleCmdsPath, serverServiceFile(projectName));

    // Dockerfile.prod 
    const dockerfileProdGenerator = new DockerfileProdGenerator(fileSystem);
    await dockerfileProdGenerator.generate(projectPath, undefined, undefined);

    // k8s/configmap.yaml    
    const configMapGenerator = new ConfigMapGenerator(fileSystem);
    await configMapGenerator.generate(projectPath, undefined, serverYamlData);

    // k8s/deployment.yaml    
    const deploymentGenerator = new DeploymentGenerator(fileSystem);
    await deploymentGenerator.generate(projectPath, undefined, serverYamlData);

    // k8s/ingress.yaml    
    const ingressGenerator = new IngressGenerator(fileSystem);
    await ingressGenerator.generate(projectPath, undefined, serverYamlData);

    // k8s/ingress.yaml    
    const jobGenerator = new JobGenerator(fileSystem);
    await jobGenerator.generate(projectPath, undefined, serverYamlData);

    // k8s/service.yaml    
    const serviceGenerator = new ServiceGenerator(fileSystem);
    await serviceGenerator.generate(projectPath, undefined, serverYamlData);

    // k8s/secret.yaml    
    const secretGenerator = new SecretGenerator(fileSystem);
    await secretGenerator.generate(projectPath, undefined, serverYamlData);


    //env
    const envGenerator = new EnvGenerator(fileSystem);
    await envGenerator.generate(projectPath, undefined, serverYamlData);
    insertAtFileEnd(path.join(path.join(projectPath, `${projectName}_server`), '.gitignore'), '.env');

    await executeCommand(SERVERPOD_GENERATE, serverPath);
}


