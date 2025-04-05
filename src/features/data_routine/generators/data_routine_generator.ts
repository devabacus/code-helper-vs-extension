import { BaseGenerator } from "../../../core/generators/base_generator";
import { IFileSystem } from "../../../core/interfaces/file_system";


export abstract class DataRoutineGenerator extends BaseGenerator<any> {

    constructor(fileSystem: IFileSystem) {super(fileSystem)}


    protected abstract getPath(featurePath: string, entityName: string): string;
    protected abstract getContent(data?: any): string;

    async generate(featurePath: string, entityName: string, data?: any): Promise<void> {
        return super.generate(featurePath, entityName, data);
    }

}

