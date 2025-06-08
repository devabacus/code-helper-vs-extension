// import assert from "assert";
// import { serverDataYamlExample } from "./server_data_yaml_example"; // Убедитесь, что путь корректен
// import { parseServerDataYaml, ServerDataConfig } from "../../../features/serverpod/server_yaml_parser";


// suite('Server Data YAML Parser (Simplified)', () => {
//     test('Должен корректно парсить server_data.yaml и соответствовать ожидаемому объекту', () => {
//         const parsedConfig = parseServerDataYaml(serverDataYamlExample); //

//         const expectedConfig: ServerDataConfig = {
//             project: {
//                 name: "projectName"
//             },
//             server: {
//                 ip: "",
//                 domain: "domain.com",
//                 http_port: "8080:80",
//                 https_port: "443:443",
//                 subdomain: {
//                     api: "api",
//                     web: "web",
//                     insights: "insights"
//                 },
//                 email: "frolprank@gmail.com"
//             },
//             database: {
//                 name: "serverpod",
//                 user: "postgres"
//             },
//             deployment: {
//                 organization: "devabacus",
//                 ssh_user: "github-actions-devabacus"
//             }
//         };

//         assert.deepStrictEqual(parsedConfig, expectedConfig, "Распарсенный конфиг не совпадает с ожидаемым");
//     });

//     test('Должен выбрасывать ошибку при некорректном YAML', () => {
//         const invalidYaml = `
// project:
//   name: "test
// server: ip: "broken"
// `;
//         assert.throws(() => parseServerDataYaml(invalidYaml), Error, "Парсер должен выбросить ошибку для некорректного YAML");
//     });

//      test('Должен выбрасывать ошибку, если YAML не парсится в объект', () => {
//         const nonObjectYaml = ` "просто строка" `;
//         assert.throws(
//             () => parseServerDataYaml(nonObjectYaml),
//             (err: any) => {
//                 return err instanceof Error && (err.message.includes('YAML content did not parse to an object') || err.message.includes('expected a single document in the stream'));
//             },
//             "Парсер должен выбросить ошибку, если YAML не является объектом"
//         );
//     });
// });