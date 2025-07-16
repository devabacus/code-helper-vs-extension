import { IProjectStructure } from "./i_project_structure";


export interface IWorkspaceStructure {
    core: IProjectStructure;
    feature: IProjectStructure;
}