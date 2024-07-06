#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

IMAGE_REFERENCE="${1}"

# Pull the new Docker image from GitHub Container Registry
docker pull "${IMAGE_REFERENCE}"

# Determine new and old container names and ports
if docker ps | grep -q "caho-api-v1"; then
  new_port=8081
  old_container="caho-api-v1"
  new_container="caho-api-v2"
else
  new_port=8080
  old_container="caho-api-v2"
  new_container="caho-api-v1"
fi

# Run the new container
docker run -d --name "${new_container}" \
  --env-file ~/caho.env \
  -p "${new_port}:8080" "${IMAGE_REFERENCE}"

# Wait for the new container to start up
sleep 10

# Stop and remove the old container
docker stop "${old_container}"
docker rm "${old_container}"

# Reload Nginx to update the upstream list
sudo systemctl reload nginx
