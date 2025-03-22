import * as fs from 'fs';
import * as path from 'path';
import { createFile, executeCommand } from '../../utils';
import { pubGet } from './template_project/flutter_content/terminal_commands';


export async function addDependecy(newDependency: string, projectPath: string, isDev: boolean = false):Promise<void> {
    
    const pubspecFilePath = path.join(projectPath, "pubspec.yaml");
    const content = fs.readFileSync(pubspecFilePath, { encoding: "utf-8" });        

    let textAnchor = 'dependencies:';

    if (isDev) {textAnchor = 'dev_dependencies:';}

    const newContent = content.replace(textAnchor, `${textAnchor}\n${newDependency}`);
    createFile(pubspecFilePath, newContent);

    await executeCommand(pubGet, projectPath);
    // console.log(content);
}


