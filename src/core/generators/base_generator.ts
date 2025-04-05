import { IFileSystem } from "../interfaces/file_system";
import { IGenerator } from "../interfaces/generator";


export abstract class BaseGenerator<TData = any> implements IGenerator<TData> {

    constructor(protected fileSystem: IFileSystem) { }

    protected abstract getPath(basePath: string, name: string, data?: TData): string;
    protected abstract getContent(data?: TData, name?: string): string;

    async generate(basePath: string, name: string, data?: TData): Promise<void> {
        try {
            const filePath = this.getPath(basePath, name, data);
            const content = this.getContent(data, name);
            await this.fileSystem.createFile(filePath, content);
        } catch (error) {
            this.handleError(name, basePath, error);
        }
    }
    protected handleError(name: string, basePath: string, error: unknown): never {
        throw new Error(`Ошибка генерации ${name} в ${basePath}: ${String(error)}`);
    }

}
