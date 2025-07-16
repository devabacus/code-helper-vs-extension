import { IDataStructure } from "./i_data_structure";
import { IDomainStructure } from "./i_domain_structure";
import { IPresentationStructure } from "./i_presentation_structure";

export interface IProjectStructure {
    data: IDataStructure,
    domain: IDomainStructure,
    presentation: IPresentationStructure
}