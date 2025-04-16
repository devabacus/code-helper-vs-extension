import { IPathHandle } from "../../features/utils/path_util";
import { IFileSystem } from "../interfaces/file_system";
import { IGenerator } from "../interfaces/generator";


export abstract class BaseGenerator<TData = any> implements IGenerator<TData> {

    constructor(protected fileSystem: IFileSystem) { }

    protected abstract getPath(basePath: string, name?: string, data?: TData): string;
    protected abstract getContent(data?: TData, name?: string, path?: string): string;

    async generate(basePath: string, name?: string, data?: TData): Promise<void> {
        try {
            const filePath = this.getPath(basePath, name, data);
            const content = this.getContent(data, name, basePath);
            await this.fileSystem.createFile(filePath, content);
        } catch (error) {
            this.handleError(basePath, error, name);
        }
    }
    protected handleError(basePath: string, error: unknown, name?: string, ): never {
        throw new Error(`Ошибка генерации ${name} в ${basePath}: ${String(error)}`);
    }

}
