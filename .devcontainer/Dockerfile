# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.148.1/containers/codespaces-linux/.devcontainer/base.Dockerfile

FROM mcr.microsoft.com/vscode/devcontainers/universal:latest

USER root

# [Option] Install Docker CLI
ARG INSTALL_DOCKER="false"
COPY library-scripts/docker-debian.sh /tmp/library-scripts/
RUN if [ "${INSTALL_DOCKER}" = "true" ]; then \
        rm -f /usr/local/share/docker-init.sh \
        && bash /tmp/library-scripts/docker-debian.sh "true" "/var/run/docker-host.sock" "/var/run/docker.sock" "codespace"; \
    fi \
    && rm -rf /var/lib/apt/lists/* /tmp/library-scripts/

USER codespace

# ** [Optional] Uncomment this section to install additional packages. **
RUN sudo apt-get update 
RUN sudo export DEBIAN_FRONTEND=noninteractive \
    && sudo apt-get -y install --no-install-recommends postgresql postgresql-contrib redis-server yarn nvm

# Install Elasticsearch
RUN curl -sS https://artifacts.elastic.co/GPG-KEY-elasticsearch | (OUT=$(apt-key add - 2>&1) || echo $OUT)
RUN echo "deb https://artifacts.elastic.co/packages/oss-7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
RUN sudo apt-get update && apt-get -y install --no-install-recommends elasticsearch-oss

RUN sudo -i service elasticsearch start
RUN sudo service postgresql start
RUN sudo service redis-server start


# RUN redis-cli ping
# RUN curl http://localhost:9200
# RUN sudo su postgres psql -c "CREATE ROLE codespace WITH SUPERUSER CREATEDB CREATEROLE LOGIN;/."
