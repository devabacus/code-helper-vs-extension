export const serverDataYamlExample = `
project:
  name: "projectName"
  
server:
  ip: ""
  domain: "domain.com"
  http_port: "8080:80"
  https_port: "443:443"
  subdomain:
    api: "api"
    web: "web"
    insights: "insights"
  email: "frolprank@gmail.com"
  
database:
  name: "serverpod"
  user: "postgres"  
  
deployment:
  organization: "devabacus"
  ssh_user: "github-actions-devabacus"
`;