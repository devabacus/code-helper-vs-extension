import path from "path";
import { getRootWorkspaceFolders } from "../../utils/path_util";
import { readFile } from "../../utils";
import { parseServerDataYaml, ServerDataConfig } from "./server_yaml_parser";
import { DockerComposeProductionGenerator } from "./docker_compose_production_generator";
import { ServiceLocator } from "../../core/services/service_locator";


export async function serverpodFileGenerate(): Promise<void> {
    const projectPath = getRootWorkspaceFolders();
    const serverDataYamlPath = path.join(projectPath, "server_data.yaml");

    const serverYamlContent = await readFile(serverDataYamlPath);

    const serverYamlParser: ServerDataConfig  = parseServerDataYaml(serverYamlContent);
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();
    const dockerComposeProdGenerator  = new DockerComposeProductionGenerator(fileSystem);
    await dockerComposeProdGenerator.generate(projectPath, undefined, serverYamlParser);
}


