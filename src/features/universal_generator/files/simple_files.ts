import { IWorkspaceStructure } from "../project_structure/interfaces/i_workspace_structure";


// export function getStaticFilesStructure(workspace: IWorkspaceStructure): { [key: string]: string[] } {
//    return {
//       // Ключ: результат вызова метода, например 'lib/core/data/datasources/local/daos'
//       // Значение: массив имен файлов в этой директории
   
//       [workspace.feature.data.localInterfacesPath]: ['category_local_datasource_service.dart'],
//       [workspace.feature.data.remoteInterfacesPath]: ['category_remote_datasource_service.dart'],
//       // ... и так далее для остальных папок и файлов
//    };
// }


export const SIMPLE_FILES = [
  'data/datasources/local/interfaces/category_local_datasource_service.dart',
  'data/datasources/remote/interfaces/category_remote_datasource_service.dart',
  //   'category_repository.dart',
  //   'category_usecase_create.dart',
  // ... другие простые файлы
];