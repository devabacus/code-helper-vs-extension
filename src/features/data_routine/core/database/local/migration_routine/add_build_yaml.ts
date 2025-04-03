import path from "path";
import { createFile } from "@utils";
import { build_yaml } from "./build_yaml";


export async function addDriftDB(rootPath: string): Promise<void> {
    const databae_build_yaml_path = path.join(rootPath, "build.yaml");
    await createFile(databae_build_yaml_path, build_yaml);
}

