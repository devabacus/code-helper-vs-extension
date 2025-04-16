import { IPathHandle } from "../../features/utils/path_util";

export interface FileGenerator {
    generate(basePath: string, entitiesName: string, data?: any, pathData?: IPathHandle): Promise<void>;
}
