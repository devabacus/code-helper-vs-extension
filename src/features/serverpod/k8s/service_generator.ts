import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ServerDataConfig } from '../server_yaml_parser';

export class ServiceGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `${projectName}_server`, 'k8s', 'service.yaml');
  }

  protected getContent(data?: ServerDataConfig): string {
    if (!data) {
      throw new Error('Данные конфигурации (ServerDataConfig) не предоставлены');
    }

    const apiFqdn = `${data.server.subdomain.api}.${data.server.domain}`;
    const insightsFqdn = `${data.server.subdomain.insights}.${data.server.domain}`;
    const webFqdn = `${data.server.subdomain.web}.${data.server.domain}`;
    const appName = data.project.name;
    const reddis = data.reddis;
    const db = data.database;


    return `
apiVersion: v1
kind: Service
metadata:
  name: ${appName}-server-service
spec:
  selector:
    app: ${appName}-server    
  ports:
    - name: api
      protocol: TCP
      port: 8080
      targetPort: 8080
    - name: insights
      protocol: TCP
      port: 8081
      targetPort: 8081
    - name: web
      protocol: TCP
      port: 8082
      targetPort: 8082
    `;
  }
}
