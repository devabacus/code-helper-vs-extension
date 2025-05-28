import * as path from 'path';
import { BaseGenerator } from '../../core/generators/base_generator'; // Убедитесь, что путь корректен
import { IFileSystem } from '../../core/interfaces/file_system';   // Убедитесь, что путь корректен
import { ServerDataConfig } from './server_yaml_parser'; // Импорт из вашего парсера

export class DockerComposeProductionGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    // Предполагаем, что basePath - это корень проекта Serverpod, где должен лежать docker-compose.yml
    return path.join(basePath, 'docker-compose.production.yaml');
  }

  protected getContent(data?: ServerDataConfig): string {
    if (!data) {
      throw new Error('Данные конфигурации (ServerDataConfig) не предоставлены для генерации docker-compose.production.yaml.');
    }

    const appName = data.project.name;

    // Формируем FQDN для Traefik правил
    const apiFqdn = `${data.server.subdomain.api}.${data.server.domain}`;
    const insightsFqdn = `${data.server.subdomain.insights}.${data.server.domain}`;
    const webFqdn = `${data.server.subdomain.web}.${data.server.domain}`;

    // const ghcrOrg = data.deployment.organization; // Из server_data.yaml


    return `
services:
  traefik:
    restart: on-failure
    image: traefik:v3.0
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=${data.server.email}"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "${data.server.http_port}"
      - "${data.server.https_port}"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "./letsencrypt:/letsencrypt"
    depends_on:    
      - postgres
      - serverpod
    networks:
      - serverpod-network
         
  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-postgres} -d \${POSTGRES_DB:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 30s
    restart: unless-stopped
    image: postgres:16
    labels:
      - "traefik.enable=false"
    ports:
      - "127.0.0.1:5433:5432"
    environment:
      POSTGRES_USER: \${POSTGRES_USER}
      POSTGRES_DB: \${POSTGRES_DB}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
    volumes:
      - app_data:/var/lib/postgresql/data
    networks:
      - serverpod-network

  serverpod:
    restart: unless-stopped
    image: ghcr.io/\${GHCR_ORG}/${appName}_server:latest
    environment:
      SERVERPOD_DATABASE_PASSWORD: \${SERVERPOD_DATABASE_PASSWORD}
      SERVERPOD_DATABASE_HOST: postgres
      SERVERPOD_DATABASE_NAME: \${SERVERPOD_DATABASE_NAME}
      SERVERPOD_DATABASE_USER: \${SERVERPOD_DATABASE_USER}
      SERVERPOD_DATABASE_PORT: 5432
      SERVERPOD_DATABASE_REQUIRE_SSL: false
      SERVERPOD_DATABASE_IS_UNIX_SOCKET: false
      SERVERPOD_SERVICE_SECRET: \${SERVERPOD_SERVICE_SECRET}
      SERVERPOD_MAX_REQUEST_SIZE: \${SERVERPOD_MAX_REQUEST_SIZE}
    command:
      [
        "--mode",
        "production",
        "--server-id",
        "default",
        "--logging",
        "normal",
        "--role",
        "monolith",
        "--apply-migrations",
      ]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(${apiFqdn})"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.service=api-service"
      - "traefik.http.routers.api.tls.certresolver=myresolver"
      - "traefik.http.services.api-service.loadbalancer.server.port=8080"

      - "traefik.http.routers.insights.rule=Host(${insightsFqdn})"
      - "traefik.http.routers.insights.entrypoints=websecure"
      - "traefik.http.routers.insights.service=insights-service"
      - "traefik.http.routers.insights.tls.certresolver=myresolver"
      - "traefik.http.services.insights-service.loadbalancer.server.port=8081"

      - "traefik.http.routers.web.rule=Host(${webFqdn})"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.service=web-service"
      - "traefik.http.routers.web.tls.certresolver=myresolver"
      - "traefik.http.services.web-service.loadbalancer.server.port=8082"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - serverpod-network

networks:
  serverpod-network:
    name: serverpod-network
    driver: bridge

volumes:
  app_data:
    `;
  }
}
