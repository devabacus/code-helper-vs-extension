import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { executeCommand } from '../../utils';



export function addPubSpecDependency(projectPath: string, packageName: string) {
    const pubspecPath = path.join(projectPath, 'pubspec.yaml');
    if (fs.existsSync(pubspecPath)) {
        let pubspecContent = fs.readFileSync(pubspecPath, 'utf8');
        pubspecContent = pubspecContent.replace(
            'dependencies:',
            `dependencies:\n  ${packageName}:\n    path: ../`
        );
        fs.writeFileSync(pubspecPath, pubspecContent);
    } else {
        vscode.window.showErrorMessage(`Файл pubspec.yaml не найден в ${projectPath}`);
    }
}


export async function addDependecy(newDependency: string, projectPath: string):Promise<void> {
    
    const pubspecFilePath = path.join(projectPath, "pubspec.yaml");
    const content = fs.readFileSync(pubspecFilePath, { encoding: "utf-8" });        
    const newContent = content.replace('dependencies:', `dependencies:\n${newDependency}`);
    fs.writeFileSync(pubspecFilePath, newContent, { encoding: "utf-8" });
    await executeCommand('flutter pub get', projectPath);
    // console.log(content);
}
