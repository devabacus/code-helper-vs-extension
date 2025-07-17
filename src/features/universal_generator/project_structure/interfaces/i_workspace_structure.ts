import { IProjectStructure } from "../impl/default_project_structure";


export interface IWorkspaceStructure {
    core: IProjectStructure;
    feature: IProjectStructure;
}