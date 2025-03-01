import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';



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
