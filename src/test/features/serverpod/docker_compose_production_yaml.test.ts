// import assert from 'assert';
// import { DockerComposeProductionGenerator } from '../../../features/serverpod/docker_compose_production_generator'; // Путь к вашему генератору
// import { ServerDataConfig } from '../../../features/serverpod/server_yaml_parser'; // Путь к вашему интерфейсу
// import { MockFileSystem } from '../../mocks/mock_file_system'; // Предполагается, что у вас есть MockFileSystem
// import { dockerComposeProductionExample } from './docker_compose_production_yaml_example'; // Ваш эталонный YAML

// suite('DockerComposeProductionGenerator Test Suite', () => {
//   let mockFileSystem: MockFileSystem;
//   let generator: DockerComposeProductionGenerator;

//   setup(() => {
//     mockFileSystem = new MockFileSystem(); // Инициализация моковой файловой системы
//     generator = new DockerComposeProductionGenerator(mockFileSystem);
//   });

//   test('Должен генерировать docker-compose.production.yaml соответствующий образцу', () => {
//     const testServerData: ServerDataConfig = {
//       project: {
//         name: "projectName",
//       },
//       server: {
//         ip: "",
//         domain: "domain.com",
//         http_port: "8080:80", 
//         https_port: "443:443",
//         subdomain: {
//           api: "api",        
//           web: "web",        
//           insights: "insights",
//         },
//         email: "frolprank@gmail.com",
//       },
//       database: {
//         name: "serverpod",   
//         user: "postgres", 
//       },
//       deployment: {
//         organization: "devabacus",
//         ssh_user: "github-actions-devabacus",
//       },
//     };

//     const generatedContent = generator.getContent(testServerData);

//     assert.strictEqual(generatedContent.trim(), dockerComposeProductionExample.trim(), "Сгенерированный YAML не совпадает с эталоном.");
//   });

  
// });