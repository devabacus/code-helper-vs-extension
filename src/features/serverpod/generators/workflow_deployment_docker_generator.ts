import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator'; // Убедитесь, что путь корректен
import { IFileSystem } from '../../../core/interfaces/file_system';   // Убедитесь, что путь корректен
import { ServerDataConfig } from '../server_yaml_parser'; // Импорт из вашего парсера

export class WorkflowDeploymentDockerGenerator extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `.github`, `workflows`, 'deployment-docker.yml');
  }

  protected getContent(data?: ServerDataConfig): string {
    if (!data) {
      throw new Error('Данные конфигурации (ServerDataConfig)');
    }

    const appName = data.project.name;

    return `

name: Build and Deploy to Kubernetes

on:
  push:
    branches: [ master ]
  workflow_dispatch:

jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      tag: \${{ steps.meta.outputs.version }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ secrets.REGISTRY_DOMAIN }}/${appName}-server
          tags: |
            type=sha,prefix=,format=short

      - name: Log in to Timeweb Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ secrets.REGISTRY_DOMAIN }}
          username: \${{ secrets.REGISTRY_USER }}
          password: \${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./${appName}_server
          file: ./${appName}_server/Dockerfile.prod
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}

  deploy-to-cluster:
    needs: build-and-push-image
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Kubeconfig
        uses: azure/k8s-set-context@v4
        with:
          kubeconfig: \${{ secrets.KUBE_CONFIG }}

      - name: Create or Update Image Pull Secret
        run: |
          kubectl create secret docker-registry timeweb-registry-secret             --docker-server=\${{ secrets.REGISTRY_DOMAIN }}             --docker-username=\${{ secrets.REGISTRY_USER }}             --docker-password=\${{ secrets.REGISTRY_PASSWORD }}             --docker-email=${data.server.email}             --dry-run=client -o yaml | kubectl apply -f -

      - name: Create or Update Kubernetes Secret for Serverpod
        run: |
          kubectl create secret generic serverpod-secrets-${appName}             --from-literal=database-password='\${{ secrets.DB_PASSWORD }}'             --from-literal=redis-password='\${{ secrets.REDIS_PASSWORD }}'             --from-literal=service-secret='\${{ secrets.SERVICE_SECRET }}'             --dry-run=client -o yaml | kubectl apply -f -

      - name: Update manifests with new image tag
        run: |
          echo "Updating manifests with image tag: \${{ needs.build-and-push-image.outputs.tag }}"
          
          # Более универсальная замена - заменяет любой тег после ${appName}-server:
          sed -i 's|.*/${appName}-server:.*|\${{ secrets.REGISTRY_DOMAIN }}/${appName}-server:\${{ needs.build-and-push-image.outputs.tag }}|g' ${appName}_server/k8s/deployment.yaml
          sed -i 's|.*/${appName}-server:.*|\${{ secrets.REGISTRY_DOMAIN }}/${appName}-server:\${{ needs.build-and-push-image.outputs.tag }}|g' ${appName}_server/k8s/job.yaml
          
          # Проверяем только строку с образом
          echo "Updated deployment image:"
          grep "\${{ secrets.REGISTRY_DOMAIN }}/${appName}-server:" ${appName}_server/k8s/deployment.yaml
          echo "Updated job image:"
          grep "\${{ secrets.REGISTRY_DOMAIN }}/${appName}-server:" ${appName}_server/k8s/job.yaml

      - name: Apply infrastructure manifests
        run: |
          kubectl apply -f ${appName}_server/k8s/configmap.yaml
          kubectl apply -f ${appName}_server/k8s/service.yaml
          kubectl apply -f ${appName}_server/k8s/ingress.yaml

      - name: Run database migration
        run: |
          # Удаляем старую миграцию и запускаем новую
          kubectl delete job serverpod-migration-job-${appName} --ignore-not-found=true
          kubectl apply -f ${appName}_server/k8s/job.yaml
          
          # Ждем завершения миграции
          kubectl wait --for=condition=complete job/serverpod-migration-job-${appName} --timeout=5m

      - name: Deploy main application
        run: |
          kubectl apply -f ${appName}_server/k8s/deployment.yaml
          kubectl rollout status deployment/${appName}-server-deployment --timeout=3m
          
          # Показываем финальный статус
          kubectl get pods -l app=${appName}-server
    
    `;
  }
}
