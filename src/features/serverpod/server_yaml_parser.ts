import * as yaml from 'js-yaml'; // Убедитесь, что библиотека установлена

// Определение интерфейса ServerDataConfig (можно вынести в отдельный файл и импортировать)
export interface ServerDataConfig {
  project: {
    name: string;
  };
  server: {
    ip: string;
    http_port: string;
    https_port: string;
    domain: string;
    subdomain: {
      api: string;
      web: string;
      insights: string;
    };
    email: string;
    domain_registy: string;
  };
  database: {
    host: string;
    port: string;
    name: string;
    user: string;
  };
  reddis: {
    host: string;
    port: string;
    user: string;    
  };

  deployment: {
    organization: string;
    ssh_user: string;
  };
}

// Функция парсера (можно вынести в отдельный файл и импортировать)
export function parseServerDataYaml(yamlContent: string): ServerDataConfig {
  try {
    const config = yaml.load(yamlContent);
    if (typeof config !== 'object' || config === null) {
      throw new Error('YAML content did not parse to an object.');
    }
    return config as ServerDataConfig;
  } catch (e) {
    console.error("Ошибка парсинга YAML:", e);
    throw new Error(`Не удалось распарсить YAML: ${e instanceof Error ? e.message : String(e)}`);
  }
}
