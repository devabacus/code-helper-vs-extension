
export interface IGenerator<TData = any, TResult = void> {
    generate(path: string, name: string, data?: TData): Promise<TResult>;
}
