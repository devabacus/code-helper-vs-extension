import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator'; // Убедитесь, что путь корректен
import { IFileSystem } from '../../../core/interfaces/file_system';   // Убедитесь, что путь корректен
import { ServerDataConfig } from '../server_yaml_parser'; // Импорт из вашего парсера
import { readFile } from '../../../utils';

export class EnvGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `${projectName}_server`, '.env');
  }

  protected getContent(data?: ServerDataConfig): string {
    if (!data) {
      throw new Error('Данные конфигурации (ServerDataConfig) не предоставлены');
    }

    const appName = data.project.name;

    const apiFqdn = `${data.server.subdomain.api}.${data.server.domain}`;
    const insightsFqdn = `${data.server.subdomain.insights}.${data.server.domain}`;
    const webFqdn = `${data.server.subdomain.web}.${data.server.domain}`;

    return `PAT_USER_GITHUB = devabacus
PAT_GITHUB = G:\\Obsidian vault\\Blogging\\Кодинг\\Serverpod
SSH_HOST = ${data.server.ip}
SSH_USER = ${data.deployment.ssh_user}
SSH_PRIVATE_KEY = C:\\Users\\User\\.ssh\\id_ed25519

SERVERPOD_DATABASE_NAME = ${data.database.name}
SERVERPOD_DATABASE_USER = ${data.database.user}
SERVERPOD_DATABASE_PASSWORD = ${appName}_server/config/passowrds.yaml
SERVERPOD_API_SERVER_PUBLIC_HOST = ${apiFqdn}
SERVERPOD_WEB_SERVER_PUBLIC_HOST = ${webFqdn}
SERVERPOD_INSIGHTS_SERVER_PUBLIC_HOST = ${insightsFqdn}
SERVERPOD_SERVICE_SECRET = ${appName}_server/config/passowrds.yaml
    `;
  }
}
