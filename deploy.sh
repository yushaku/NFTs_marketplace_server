#!/bin/bash

SERVER=$(echo -e "dev\nprod" | fzf --prompt="Select Server: ")

# Default values for DOMAIN and IP
DOMAIN="staging"
IP="an_dev"

# Set DOMAIN and IP based on the selected server
if [ "$SERVER" == "prod" ]; then
  DOMAIN="production"
  IP="an_prod"
fi

# Use fzf to select services (api, scanner, or both)
SERVICES=$(echo -e "an-api\nscanner\nboth" | fzf --prompt="Select Service: ")

# Set the services to deploy
if [ "$SERVICES" == "both" ]; then
  SERVICES="an-api scanner"
elif [ "$SERVICES" == "an-api" ]; then
  SERVICES="an-api"
elif [ "$SERVICES" == "scanner" ]; then
  SERVICES="scanner"
fi

# Confirm the selection
echo "Deploying to server $DOMAIN with $SERVICES service(s)"

build() {
  echo "Build $SERVER"
  rm -rf dist
  mkdir -p dist
  export GENERATE_SOURCEMAP=false
  yarn build
  cp package.json dist/package.json
  cp yarn.lock dist/yarn.lock
  cp ".env.$SERVER" dist/.env
}

deploy() {
  echo "Deploy to $DOMAIN"
  cd dist
  du -sh ./*
  rsync -avz --exclude={node_modules,public} -e ssh . "ubuntu@$IP:/home/ubuntu/anonymaus-backend/dist"
}

reload() {
  ssh "$IP" -t "bash -i -c 'source ~/.bashrc && cd /home/ubuntu/anonymaus-backend && pnpm install && pm2 reload ${SERVICES}'"
}

build
deploy
reload
