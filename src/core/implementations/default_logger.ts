import { Logger } from "../interfaces/logger";



export class DefaultLogger implements Logger{
    
    log(val: string): void {
        console.log(val);
    }
    
}