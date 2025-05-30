import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ServerDataConfig } from '../server_yaml_parser';

export class ConfigProductionGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `${projectName}_server`, 'config', 'production.yaml');
  }

  protected getContent(data?: ServerDataConfig): string {
    if (!data) {
      throw new Error('Данные конфигурации (ServerDataConfig) не предоставлены');
    }

    const apiFqdn = `${data.server.subdomain.api}.${data.server.domain}`;
    const insightsFqdn = `${data.server.subdomain.insights}.${data.server.domain}`;
    const webFqdn = `${data.server.subdomain.web}.${data.server.domain}`;

    return `

# Configuration for the main API server.
apiServer:
  port: 8080
  publicHost: ${apiFqdn}
  publicPort: 443
  publicScheme: https

# Configuration for the Insights server.
insightsServer:
  port: 8081
  publicHost: ${insightsFqdn}
  publicPort: 443
  publicScheme: https

# Configuration for the web server.
webServer:
  port: 8082
  publicHost: ${webFqdn}
  publicPort: 443
  publicScheme: https

# This is the database setup for your servers. The default for the Google Cloud
# Engine Terraform configuration is to connect on a private IP address.
# If you are connecting on a public IP (e.g. on AWS or Google Cloud Run), you
# connect on the public IP of the database e.g. database.examplepod.com.
database:
  host: postgres
  port: 5432
  name: ${data.database.name}
  user: ${data.database.user}
  requireSsl: false
  isUnixSocket: false

# This is the setup for Redis. The default for the Google Cloud Engine Terraform
# configuration is to connect on a private IP address.
# If you are connecting on a public IP (e.g. on AWS or Google Cloud Run), you
# connect on the public IP of the database e.g. redis.examplepod.com.
# redis:
#   enabled: false
#   host: redis.private-production.examplepod.com
#   port: 6379
  #user: # defaults to empty

maxRequestSize: 524288 # The maximum size of requests allowed in bytes

sessionLogs:
  consoleEnabled: false
  persistentEnabled: true

# futureCallExecutionEnabled: true # Defaults to true

#futureCall:
#  concurrencyLimit: 1 # Defaults to 1, a negative or null value removes the limit
#  scanInterval: 5000 # Defaults to 5000

    `;
  }
}
