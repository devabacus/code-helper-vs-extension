

export class GenerationError extends Error {
    constructor(
        public readonly entityName: string,
        public readonly featurePath: string,
        public readonly originalError: unknown,
    ) {
        super(`Ошибка при генерации ${entityName} в ${featurePath}: ${String(originalError)}`);

        this.name = "GenerationError";

    }
}