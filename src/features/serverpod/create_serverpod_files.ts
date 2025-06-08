import path from "path";
import { getRootWorkspaceFolders } from "../../utils/path_util";
import { readFile } from "../../utils";
import { parseServerDataYaml, ServerDataConfig } from "./server_yaml_parser";
import { DockerComposeProductionGenerator } from "./generators/docker_compose_production_generator";
import { ServiceLocator } from "../../core/services/service_locator";
import { DockerfileProdGeneratorLegacy } from "./generators/dockerfile_prod_generate";
import { ConfigProductionGenerator } from "./generators/config_production_generate";
import { WorkflowDeploymentDockerGenerator } from "./generators/workflow_deployment_docker_generator";
import { EnvGenerator } from "./generators/env_generator";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";


export async function serverpodFileGenerate(projectPath: string): Promise<void> {
    const projectName = path.basename(projectPath);

    const serverDataYamlPath = path.join(projectPath, `${projectName}_server`, "server_data.yaml");

    const serverYamlContent = await readFile(serverDataYamlPath);

    const serverYamlData: ServerDataConfig = parseServerDataYaml(serverYamlContent);
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();

    // docker-compose.production.yaml
    const dockerComposeProdGenerator = new DockerComposeProductionGenerator(fileSystem);
    await dockerComposeProdGenerator.generate(projectPath, undefined, serverYamlData);

    // Dockerfile.prod 
    const dockerfileProdGenerator = new DockerfileProdGeneratorLegacy(fileSystem);
    await dockerfileProdGenerator.generate(projectPath, undefined, undefined);

    // config/production.yaml
    const configProductionGenerator = new ConfigProductionGenerator(fileSystem);
    await configProductionGenerator.generate(projectPath, undefined, serverYamlData);

    // workflows/deployment-docker.yml
    const workflowDeploymentDockerGenerator = new WorkflowDeploymentDockerGenerator(fileSystem);
    await workflowDeploymentDockerGenerator.generate(projectPath, undefined, serverYamlData);

    //env
    const envGenerator = new EnvGenerator(fileSystem);
    await envGenerator.generate(projectPath, undefined, serverYamlData);
    insertAtFileEnd(path.join(path.join(projectPath, `${projectName}_server`), '.gitignore'), '.env');
}


