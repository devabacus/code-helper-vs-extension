import { FileGenerator } from "../interfaces/file_generator";
import { Logger } from "../interfaces/logger";


export class LoginGeneratorDecorator implements FileGenerator {
    constructor(private generator: FileGenerator, private logger: Logger){}

    async generate(featurePath: string, entityName: string, data?: any): Promise<void> {
        this.logger.log(`Начинаем генерацию ${entityName} в ${featurePath}`);
        await this.generator.generate(featurePath, entityName, data);
        this.logger.log(`${entityName} успешно сгенерирован`);
    }         
}