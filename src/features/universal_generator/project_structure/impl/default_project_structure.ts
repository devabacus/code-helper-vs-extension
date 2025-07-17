import { IDataStructure } from "../interfaces/i_data_structure";
import { IDomainStructure } from "../interfaces/i_domain_structure";
import { IPresentationStructure } from "../interfaces/i_presentation_structure";
import { DataStructure } from "./data_structure";
import { DomainStructure } from "./domain_structure";
import { PresentationStructure } from "./presentation_structure";


export interface IProjectStructure {
    data: IDataStructure,
    domain: IDomainStructure,
    presentation: IPresentationStructure
}

export class DefaultProjectStructure implements IProjectStructure {

    public readonly data : IDataStructure;
    public readonly domain : IDomainStructure;
    public readonly presentation : IPresentationStructure;

    constructor(basePath: string){
        this.data = new DataStructure(basePath);
        this.domain = new DomainStructure(basePath);
        this.presentation = new PresentationStructure(basePath);
    }
}