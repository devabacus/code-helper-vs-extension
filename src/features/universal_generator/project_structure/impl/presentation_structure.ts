import path from "path";
import { IPresentationStructure } from "../interfaces/i_presentation_structure";
import { ARCH_NAMES as c } from "../constants/structure_constants";

export class PresentationStructure implements IPresentationStructure {

    private basePath: string;

    constructor(featPath: string){
        this.basePath = featPath;
    }

    getPresentationPath(): string {
        return path.join(this.basePath, c.PRESENTATION);
    }
    getPresentationProviderPath(): string {
        return path.join(this.basePath, c.PRESENTATION, c.PROVIDERS);
    }
}