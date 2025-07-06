import { ServerDataConfig } from "./server_yaml_parser";

export const serverServiceFile = (data: ServerDataConfig, serverPath: string, flutterPath: string) => {
    const projectName = data.project.name;
    

return `

cd "${flutterPath}";
cd "${flutterPath}"; dart run build_runner build --delete-conflicting-outputs


REGISTRY_DOMAIN
REGISTRY_USER
REGISTRY_PASSWORD
REGISTRY_EMAIL
REDIS_PASSWORD
DB_PASSWORD
SERVICE_SECRET
KUBE_CONFIG

# serverpod
cd "${serverPath}";

docker compose up -d
serverpod create-migration --experimental-features=all
serverpod generate --experimental-features=all
dart bin/main.dart --apply-migrations

cd "${serverPath}"; serverpod create-migration --experimental-features=all
cd "${serverPath}"; serverpod generate --experimental-features=all




docker compose down -v

#kubernaties
# 1. Установить nginx ingress
# 2. Установить дополнение cert-manager
# Секрет для Docker Registry
kubectl apply -f k8s_1/

# проброс порта для бд
Start-Job -ScriptBlock { kubectl port-forward pod/pg-proxy-pod 54321:${data.database.port} }
kubectl port-forward pod/pg-proxy-pod 54321:${data.database.port}


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

-- 1. Создаем КЛИЕНТА (Customer)
-- ID: 1a8c7b80-0a13-4c9a-8a5e-9e7c1f8d2a6b
INSERT INTO "public"."customer" ("id", "userId", "createdAt", "lastModified", "isDeleted", "name", "email", "info", "subscriptionStatus")
VALUES
('1a8c7b80-0a13-4c9a-8a5e-9e7c1f8d2a6b', 1, NOW(), NOW(), false, 'Моя первая компания', 'contact@mycompany.com', 'Основной клиент', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Создаем РОЛЬ (Role), привязанную к этому клиенту
-- ID: 2b9d8c91-1b24-5d0b-9b6f-0f8d2e9e3b7c
INSERT INTO "public"."role" ("id", "customerId", "name", "description", "createdAt", "updatedAt")
VALUES
('2b9d8c91-1b24-5d0b-9b6f-0f8d2e9e3b7c', '1a8c7b80-0a13-4c9a-8a5e-9e7c1f8d2a6b', 'Администратор', 'Полные права доступа', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Создаем РАЗРЕШЕНИЯ (Permissions)
-- ID 1: 3cae9da2-2c35-6e1c-ac7a-1a9e3f0f4c8d
-- ID 2: 4dbfaeb3-3d46-7f2d-bd8b-2b0f4a1a5d9e
INSERT INTO "public"."permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
('3cae9da2-2c35-6e1c-ac7a-1a9e3f0f4c8d', 'manage_tasks', 'Управление задачами', NOW(), NOW()),
('4dbfaeb3-3d46-7f2d-bd8b-2b0f4a1a5d9e', 'manage_users', 'Управление пользователями', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Связываем РОЛЬ и РАЗРЕШЕНИЯ (RolePermission)
INSERT INTO "public"."role_permission" ("id", "roleId", "permissionId")
VALUES
(gen_random_uuid(), '2b9d8c91-1b24-5d0b-9b6f-0f8d2e9e3b7c', '3cae9da2-2c35-6e1c-ac7a-1a9e3f0f4c8d'),
(gen_random_uuid(), '2b9d8c91-1b24-5d0b-9b6f-0f8d2e9e3b7c', '4dbfaeb3-3d46-7f2d-bd8b-2b0f4a1a5d9e')
ON CONFLICT (id) DO NOTHING;

-- 5. Связываем ПОЛЬЗОВАТЕЛЯ (userId=1) с КЛИЕНТОМ и РОЛЬЮ (CustomerUser)
INSERT INTO "public"."customer_user" ("id", "customerId", "userId", "roleId")
VALUES
(gen_random_uuid(), '1a8c7b80-0a13-4c9a-8a5e-9e7c1f8d2a6b', 1, '2b9d8c91-1b24-5d0b-9b6f-0f8d2e9e3b7c')
ON CONFLICT (id) DO NOTHING;
`;};