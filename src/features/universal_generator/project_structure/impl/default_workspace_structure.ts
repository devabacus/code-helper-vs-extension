import path from 'path';
import { IWorkspaceStructure } from '../interfaces/i_workspace_structure';
import { DefaultProjectStructure, IProjectStructure } from './default_project_structure';

export class DefaultWorkspaceStructure implements IWorkspaceStructure {
    public readonly core: IProjectStructure;
    public readonly feature: IProjectStructure;

    constructor(
        projectRoot: string,
        featureName: string
    ) {
        const corePath = path.join(projectRoot, 'core');
        const featurePath = path.join(projectRoot, 'features', featureName);

        this.core = new DefaultProjectStructure(corePath);
        this.feature = new DefaultProjectStructure(featurePath);
    }
}