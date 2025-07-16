import { DataStructure } from "./data_structure";
import { DomainStructure } from "./domain_structure";
import { IProjectStructure } from "../interfaces/i_project_structure";
import { PresentationStructure } from "./presentation_structure";

export class DefaultProjectStructure implements IProjectStructure {
    public readonly data : DataStructure;
    public readonly domain : DomainStructure;
    public readonly presentation : PresentationStructure;

    constructor(basePath: string){
        this.data = new DataStructure(basePath);
        this.domain = new DomainStructure(basePath);
        this.presentation = new PresentationStructure(basePath);
    }
}