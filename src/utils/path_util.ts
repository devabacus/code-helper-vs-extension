import path from "path";
import { window, workspace } from "vscode";

// получение директории workspace
export function getRootWorkspaceFolders() {
    const workspaceFolders = workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length == 0) {
          window.showErrorMessage('Откройте папку');
          throw new Error('Workspace not found');
      }
  
      return workspaceFolders[0].uri.fsPath;
  }

export function getLibPath() {
    return `${getRootWorkspaceFolders()}/lib`;
}



export function getUserSnippetsPath(): string {
    return path.join(process.env.APPDATA || "", "Code", "User", "snippets");
}

export function getActiveEditorPath(): string | undefined {
    return window.activeTextEditor?.document.uri.fsPath;
}





interface IPathHandle {
    featName: string,
    featurePath: string
    rootPath: string
}


export function getPathData(filePath: string): IPathHandle {
    const featureName = filePath.split('features')[1].split('\\')[1];
    const _featurePath = filePath.split('presentation')[0];
    const rootPath = filePath.split('lib')[0];
    const featurePath = path.resolve(_featurePath);

    
    return { featName: featureName, featurePath: featurePath, rootPath: rootPath };

}

