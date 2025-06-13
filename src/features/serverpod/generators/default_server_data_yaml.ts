
export const serverpodDataYaml = (projectName: string) => {
    return `
project:
  name: "${projectName}"
  
server:
  ip: ""
  http_port: "80:80"
  https_port: "443:443"
  domain: "my-points.ru"
  subdomain:
  api: "api"
  web: "web"
  insights: "insights"
  email: "frolprank@gmail.com"
  domain_registy: ""
  
  database:
  host: "192.168.0.6"
  port: "5432"
  name: "${projectName}_db"
  user: "${projectName}_user"  
  
  reddis:
  host: "192.168.0.7"
  port: "6379"
  user: "default"
  
  deployment:
  organization: "devabacus"
  ssh_user: "serverpod"

`;};
