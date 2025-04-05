import { GenerationError } from "../../../core/error/generation_error";
import { FileGenerator } from "../../../core/interfaces/file_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";




export abstract class BaseGenerator implements FileGenerator {

    constructor(protected fileSystem: IFileSystem) { }

    protected abstract getPath(featurePath: string, entityName: string): string;
    protected abstract getContent(data?: any): string;

    async generate(featurePath: string, entityName: string, data?: any): Promise<void> {
        try {
            const filePath = this.getPath(featurePath, entityName);
            const content = this.getContent(data);
            await this.fileSystem.createFile(filePath, content);
        } catch (error) {
            throw new GenerationError(entityName, featurePath, error);

        }

    }

}

