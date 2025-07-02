export const server_pubspec_yaml_file = (projectName: string) => {
  return `
name: ${projectName}_server
description: Starting point for a Serverpod server.

environment:
  sdk: '>=3.3.0 <4.0.0'

dependencies:
  serverpod: 2.9.1
  serverpod_auth_server: ^2.8.0 

dev_dependencies:
  lints: '>=3.0.0 <6.0.0'
  test: '^1.24.2'
  serverpod_test: 2.9.1

`;
};