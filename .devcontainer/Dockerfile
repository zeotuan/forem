# [Choice] Ruby version: 2, 2.7, 2.6, 2.5
ARG VARIANT=2
FROM mcr.microsoft.com/vscode/devcontainers/ruby:${VARIANT}

# [Option] Install Node.js
ARG INSTALL_NODE="true"
ARG NODE_VERSION="lts/*"
RUN if [ "${INSTALL_NODE}" = "true" ]; then su vscode -c "source /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION} 2>&1"; fi

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment this line to install additional gems.
# RUN gem install <your-gem-names-here>

# [Optional] Uncomment this line to install global node packages.
# RUN su vscode -c "source /usr/local/share/nvm/nvm.sh && npm install -g <your-package-here>" 2>&1

RUN sudo apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends postgresql postgresql-contrib

# Install Elasticsearch
RUN curl -sS https://artifacts.elastic.co/GPG-KEY-elasticsearch | (OUT=$(apt-key add - 2>&1) || echo $OUT)
# RUN wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
RUN echo "deb https://artifacts.elastic.co/packages/oss-7.x/apt stable main" | sudo tee -a /etc/apt/sources.list.d/elastic-7.x.list
RUN sudo apt-get update
RUN su vscode -c "apt-get install elasticsearch-oss"
RUN usr/share/elasticsearch/bin/elasticsearch -d

# Install redis with the instructions above and start the server.
RUN sudo service postgresql start
RUN redis-cli ping
RUN curl http://localhost:9200
RUN sudo su - postgres
RUN psql -c "CREATE ROLE codespace WITH SUPERUSER CREATEDB CREATEROLE LOGIN;" 
# exit # to return to codespace user
