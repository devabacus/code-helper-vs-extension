import * as fs from 'fs';
import * as path from 'path';
import { createFile } from '../../../utils';


export async function crBarrelFls(dirPath: string): Promise<void> {

  const _dirPath = path.resolve(dirPath);
  recursiveDir(path.resolve(_dirPath));
}

const isDir = (item: string) => !item.includes('.');

function recursiveDir(dirPath: string) {

  const pathList = getDirsPath(dirPath);
  createIndexFile(dirPath);

  for (const pth of pathList) {
    recursiveDir(pth);
  }
}

function getDirsPath(dirPath: string): string[] {
  const pathItems = fs.readdirSync(dirPath);
  const dirItems = pathItems.filter((item) => isDir(item));
  return dirItems.map((item) => path.join(dirPath, item));
}

async function createIndexFile(pathDir: string) {

  const isAccesptDir = (dir: string) => !['lib', 'features'].includes(dir);
  const isAcceptFiles = (item: string): boolean => !item.includes('index.dart') && !item.includes('.g.dart');

  if (!isAccesptDir(path.basename(pathDir))) { return; }

  const pathItems = fs.readdirSync(pathDir);

  const fileList = pathItems.filter((item) => !isDir(item) && isAcceptFiles(item));
  const fileListModified = fileList.map((item) => `export '${item}';`);
  const filesContent = fileListModified.join('\n');

  const dirList = pathItems.filter((item) => isDir(item));
  const dirListModified = dirList.map((item) => `export '${item}/index.dart';`);
  const dirsContent = dirListModified.join('\n');

  const indexFileContent = `${filesContent}\n${dirsContent}`;

  createFile(`${pathDir}/index.dart`, indexFileContent);
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