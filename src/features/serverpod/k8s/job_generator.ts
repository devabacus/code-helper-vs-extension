import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ServerDataConfig } from '../server_yaml_parser';

export class JobGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `${projectName}_server`, 'k8s', 'job.yaml');
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

apiVersion: batch/v1
kind: Job
metadata:
  name: serverpod-migration-job-${appName}
spec:
  template:
    spec:
      imagePullSecrets:
      - name: timeweb-registry-secret
      containers:
      - name: migrator-${appName}
        image: ...registry.twcstorage.ru/${appName}-server:latest
        command: ["/usr/local/bin/server", "--apply-migrations", "--mode", "production", "--role", "maintenance"]

        envFrom:
        - configMapRef:
            name: serverpod-config-${appName}
        env:
        - name: SERVERPOD_DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: serverpod-secrets-${appName}
              key: database-password
        - name: SERVERPOD_REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: serverpod-secrets-${appName}
              key: redis-password
        - name: SERVERPOD_SERVICE_SECRET
          valueFrom:
            secretKeyRef:
              name: serverpod-secrets-${appName}
              key: service-secret
      restartPolicy: Never
  backoffLimit: 2
    `;
  }
}
