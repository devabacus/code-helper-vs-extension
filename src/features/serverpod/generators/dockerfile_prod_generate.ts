import * as path from 'path';
import { BaseGenerator } from '../../../core/generators/base_generator';
import { IFileSystem } from '../../../core/interfaces/file_system';
import { ServerDataConfig } from '../server_yaml_parser';

export class DockerfileProdGeneratorLegacy extends BaseGenerator<ServerDataConfig> {
  constructor(fileSystem: IFileSystem) {
    super(fileSystem);
  }

  protected getPath(basePath: string, _name?: string, _data?: ServerDataConfig): string {
    const projectName = path.basename(basePath);
    return path.join(basePath, `${projectName}_server`, 'Dockerfile.prod');
  }

  protected getContent(data?: ServerDataConfig): string {

    return `
FROM dart:stable AS build

# Accept the GITHUB_PAT and GITHUB_USER as an argument
ARG GITHUB_PAT
ARG GITHUB_USER

WORKDIR /app
COPY . .

# Conditionally configure Git to use the provided GitHub token
RUN if [ -n "$GITHUB_PAT" ] && [ -n "$GITHUB_USER" ]; then \\
    echo "Configuring Git to use provided GitHub token..."; \\
    # Add GitHub's public SSH key to known_hosts for security
    mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts; \\
    git config --global credential.helper 'store'; \\
    echo "url=https://github.com/.insteadOf git://github.com/" >> ~/.gitconfig; \\
    echo "https://$GITHUB_USER:$GITHUB_PAT@github.com" > ~/.git-credentials; \\
    else \\
    echo "No GitHub token provided. Skipping Git configuration..."; \\
    fi

RUN dart pub get
RUN dart compile exe bin/main.dart -o bin/server

FROM alpine:latest

# Correcting the source directory for runtime dependencies
COPY --from=build /runtime/ /
COPY --from=build /app/bin/server server
COPY --from=build /app/config/ config/
COPY --from=build /app/web/ web/
COPY --from=build /app/migrations/ migrations/

EXPOSE 8080
EXPOSE 8081
EXPOSE 8082

ENTRYPOINT ["/server"]
CMD ["--mode", "production", "--server-id", "default", "--logging", "normal", "--role", "monolith"]
    `;
  }
}
