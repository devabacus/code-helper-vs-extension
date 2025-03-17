import * as fs from 'fs';
import * as path from 'path';
import { executeCommand } from '../../utils';


export async function addDependecy(newDependency: string, projectPath: string):Promise<void> {
    
    const pubspecFilePath = path.join(projectPath, "pubspec.yaml");
    const content = fs.readFileSync(pubspecFilePath, { encoding: "utf-8" });        
    const newContent = content.replace('dependencies:', `dependencies:\n${newDependency}`);
    fs.writeFileSync(pubspecFilePath, newContent, { encoding: "utf-8" });
    await executeCommand('flutter pub get', projectPath);
    // console.log(content);
}
