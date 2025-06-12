import { ServerDataConfig } from "../server_yaml_parser";

export const pgProxyPodFile = (data: ServerDataConfig) => {
return `
apiVersion: v1
kind: Pod
metadata:
  # Запускаем под в определенном пространстве имен для порядка
  namespace: default # Замените на свое, если нужно
  name: pg-proxy-pod
spec:
  containers:
  - name: socat-proxy
    image: alpine/socat
    args:
      - "TCP-LISTEN:5432,fork,reuseaddr"
      - "TCP:${data.database.host}:${data.database.port}"
    ports:
      - name: postgres-port # Именуем порт для ясности
        containerPort: ${data.database.port}

`;};