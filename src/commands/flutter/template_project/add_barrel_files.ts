import * as fs from 'fs';
import * as path from 'path';
import { createFile } from '../../../utils';


export async function createIndexDartFiles(dirPath: string, exludeDirs: string[] = []): Promise<void> {

  // создаем файл index.dart в каждой папке кроме lib, features
    const _dirPath = path.resolve(dirPath);
    recursiveDir(path.resolve(_dirPath));

}


const isDir = (item: string) => !item.includes('.');

function recursiveDir(dirPath: string) {

  const pathList = getDirsPath(dirPath);
  createIndexFile(dirPath);
  // const isAccesptDir = (dir: string) => !['lib', 'features'].includes(dir);

  for (const pth of pathList) {
    recursiveDir(pth);
  }

}

// создаем список путей по которым нужно пройтись
function getDirsPath(dirPath: string): string[]{
  const pathItems = fs.readdirSync(dirPath);
  const dirItems = pathItems.filter((item) => isDir(item));
  return dirItems.map((item) => path.join(dirPath, item));
}

async function createIndexFile(path: string) {


  const pathItems = fs.readdirSync(path);
  
  const fileList = pathItems.filter((item) => !isDir(item) && !item.includes('index.dart'));
  const fileListModified = fileList.map((item) => `export '${item}';`);
  const filesContent = fileListModified.join('\n');

  const dirList = pathItems.filter((item) => isDir(item));
  const dirListModified = dirList.map((item) => `export '${item}/index.dart';`);
  const dirsContent = dirListModified.join('\n');

  const indexFileContent = `${filesContent}\n${dirsContent}`;

  createFile(`${path}/index.dart`, indexFileContent);
}













// for (var folderPath of featureFolders) {
//   createFile(`${folderPath}/index.dart`, await createBarrelContent(folderPath));
// }
// // добавить barrel файлы в каждую папку
// }


// export async function createBarrelContent(folderPath: string): Promise<string>{
// // получаем все файлы по пути
// // await createFile(`${folderPath}/testfile.dart`, "//just comment" );

// const files = await getFilesInDir(folderPath);
// // создаем содержимое для barrel файла по шаблону "export 'fileName.dart';"
// return files.map(function(fileName){
// return `export '${fileName}';`;
// }).join('\n');
// return `// export`;

// }