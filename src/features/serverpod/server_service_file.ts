import { ServerDataConfig } from "./server_yaml_parser";

export const serverServiceFile = (data: ServerDataConfig) => {
    const projectName = data.project.name;

return `

SERVICE_SECRET
REGISTRY_USER = dbe81550-wise-chickadee
REGISTRY_PASSWORD
REDIS_PASSWORD
KUBE_CONFIG
DB_PASSWORD
REGISTRY_EMAIL

# serverpod
docker compose up -d
serverpod create-migration --experimental-features=all
serverpod generate --experimental-features=all
dart bin/main.dart --apply-migrations

docker compose down -v

#kubernaties
# 1. Установить nginx ingress
# 2. Установить дополнение cert-manager
# Секрет для Docker Registry
kubectl apply -f k8s_1/

# проброс порта для бд
kubectl port-forward pod/db-proxy 54321:${data.database.port}


[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes('пароль'))

# Проверим поды
kubectl get pods
kubectl get pods -w

# Проверим сервисы
kubectl get svc
kubectl get svc ${projectName}-server-service -o yaml 

# логи приложения
kubectl logs -f -l app=${projectName}-server

#kubectl logs serverpod-migration-job-ts3-6llg9

# Тестируем endpoint для получения списка TestData
Invoke-WebRequest -Uri "https://api5.my-points.ru/" -Method POST -ContentType "application/json" -Body '{"endpoint":"testData","method":"listTestDatas","params":{}}'

# Проверка доступности напрямую
Invoke-WebRequest -Uri "https://api5.my-points.ru/" -Method GET

# Проверим детали Ingress:
bashkubectl describe ingress sync2-server-ingress

docker login dbe81550-wise-chickadee.registry.twcstorage.ru
docker build -t dbe81550-wise-chickadee.registry.twcstorage.ru/${projectName}-server:latest -f Dockerfile.prod .
docker push dbe81550-wise-chickadee.registry.twcstorage.ru/${projectName}-server:latest

kubectl apply -f k8s/

kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/job.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/secret.yaml


#delete project
kubectl delete -f k8s/

kubectl delete service ${projectName}-server-service
kubectl delete ingress ${projectName}-server-ingress
kubectl delete configmap serverpod-config-${projectName}
kubectl delete job serverpod-migration-job-${projectName}
kubectl delete secret serverpod-secrets-${projectName}
kubectl delete deployment ${projectName}-server-deployment

#restart deployment
kubectl rollout restart deployment ${projectName}-server-deployment


`;};