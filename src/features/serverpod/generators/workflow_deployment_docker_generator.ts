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
    branches: [ master ] # Убедитесь, что это ваша основная ветка
  workflow_dispatch:

jobs:
  build-and-push-image:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    # "Выводим" наружу сгенерированный тег, чтобы другие задачи могли его использовать
    outputs:
      tag: \${{ steps.meta.outputs.version }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      # Этот шаг извлекает метаданные, включая уникальный тег (хеш коммита)
      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: dbe81550-wise-chickadee.registry.twcstorage.ru/${appName}-server
          tags: |
            type=sha,prefix=,format=short

      - name: Log in to Timeweb Container Registry
        uses: docker/login-action@v3
        with:
          registry: dbe81550-wise-chickadee.registry.twcstorage.ru
          username: \${{ secrets.REGISTRY_USER }}
          password: \${{ secrets.REGISTRY_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./${appName}_server
          file: ./${appName}_server/Dockerfile.prod
          push: true
          tags: \${{ steps.meta.outputs.tags }} # Используем сгенерированный уникальный тег
          labels: \${{ steps.meta.outputs.labels }}

  deploy-to-cluster:
    needs: build-and-push-image # Запускается после сборки
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Kubeconfig
        uses: azure/k8s-set-context@v4
        with:
          kubeconfig: \${{ secrets.KUBE_CONFIG }}

      - name: Create or Update Kubernetes Secret
        run: |
          kubectl create secret generic serverpod-secrets-${appName} \
            --from-literal=database-password='\${{ secrets.DB_PASSWORD }}' \
            --from-literal=redis-password='\${{ secrets.REDIS_PASSWORD }}' \
            --from-literal=service-secret='\${{ secrets.SERVICE_SECRET }}' \
            --dry-run=client -o yaml | kubectl apply -f -

      # НОВЫЙ ШАГ: Вписываем правильный тег в манифесты
      - name: Update manifests with new image tag
        run: |
          sed -i 's|image: .*|image: dbe81550-wise-chickadee.registry.twcstorage.ru/${appName}-server:\${{ needs.build-and-push-image.outputs.tag }}|g' ${appName}_server/k8s/deployment.yaml
          sed -i 's|image: .*|image: dbe81550-wise-chickadee.registry.twcstorage.ru/${appName}-server:\${{ needs.build-and-push-image.outputs.tag }}|g' ${appName}_server/k8s/job.yaml

      - name: Apply Kubernetes manifests
        run: |
          kubectl apply -f ${appName}_server/k8s/configmap.yaml
          kubectl apply -f ${appName}_server/k8s/service.yaml
          kubectl apply -f ${appName}_server/k8s/ingress.yaml
          # Удаляем старый Job перед применением нового, чтобы он гарантированно запустился
          kubectl delete job serverpod-migration-job-${appName} --ignore-not-found=true
          kubectl apply -f ${appName}_server/k8s/job.yaml
          
      - name: Wait for migration job to complete
        run: kubectl wait --for=condition=complete job/serverpod-migration-job-${appName} --timeout=5m

      - name: Deploy main application
        run: |
          kubectl apply -f ${appName}_server/k8s/deployment.yaml
          kubectl rollout status deployment/${appName}-server-deployment --timeout=2m

    `;
  }
}
