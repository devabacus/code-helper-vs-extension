export const serverServiceFile = (projectName: string) => {
return `
# serverpod
docker compose up -d
serverpod generate --experimental-features=all
dart bin/main.dart --apply-migrations
serverpod create-migration --experimental-features=all

docker compose down -v

#kubernaties
docker build -t dbe81550-wise-chickadee.registry.twcstorage.ru/${projectName}-server:latest -f Dockerfile.prod .

docker login dbe81550-wise-chickadee.registry.twcstorage.ru

docker push dbe81550-wise-chickadee.registry.twcstorage.ru/${projectName}-server:latest

kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/job.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

#restart deployment
kubectl rollout restart deployment ${projectName}-server-deployment
`;};