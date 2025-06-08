import path from "path";
import { ServiceLocator } from "../../core/services/service_locator";
import { readFile } from "../../utils";
import { insertAtFileEnd } from "../../utils/text_work/text_insert/basic-insertion";
import { DockerfileProdGeneratorLegacy } from "./generators/dockerfile_prod_generate";
import { EnvGenerator } from "./generators/env_generator";
import { ConfigMapGenerator } from "./k8s/configmap_generate";
import { parseServerDataYaml, ServerDataConfig } from "./server_yaml_parser";
import { DockerfileProdGenerator } from "./k8s/dockerfile_prod_generate";


export async function serverpodK8sFileGenerate(projectPath: string): Promise<void> {
    const projectName = path.basename(projectPath);

    const serverDataYamlPath = path.join(projectPath, `${projectName}_server`, "server_data.yaml");

    const serverYamlContent = await readFile(serverDataYamlPath);

    const serverYamlData: ServerDataConfig = parseServerDataYaml(serverYamlContent);
    const serviceLocator = ServiceLocator.getInstance();
    const fileSystem = serviceLocator.getFileSystem();


    // Dockerfile.prod 
    const dockerfileProdGenerator = new DockerfileProdGenerator(fileSystem);
    await dockerfileProdGenerator.generate(projectPath, undefined, undefined);

    // k8s/configmap.yaml    
    const configMapGenerator = new ConfigMapGenerator(fileSystem);
    await configMapGenerator.generate(projectPath, undefined, serverYamlData);


    await dockerfileProdGenerator.generate(projectPath, undefined, undefined);



    //env
    const envGenerator = new EnvGenerator(fileSystem);
    await envGenerator.generate(projectPath, undefined, serverYamlData);
    insertAtFileEnd(path.join(path.join(projectPath, `${projectName}_server`), '.gitignore'), '.env');
}


