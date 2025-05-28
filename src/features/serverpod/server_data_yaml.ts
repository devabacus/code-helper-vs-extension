
export const serverpodDataYaml = (projectName: string) => {
    return `
project:
  name: "${projectName}"
  
server:
  ip: ""
  http_port: "8080:80"
  https_port: "443:443"
  domain: "domain.com"
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

`;};
