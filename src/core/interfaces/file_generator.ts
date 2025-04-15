
export interface FileGenerator {
    generate(featurePath: string, entitiesName: string, data?: any): Promise<void>;
}
