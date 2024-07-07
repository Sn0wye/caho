#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

IMAGE_REFERENCE=$1

echo "IMAGE_REFERENCE: $IMAGE_REFERENCE"

# Pull the new Docker image from GitHub Container Registry
echo "Pulling Docker image: $IMAGE_REFERENCE"
docker pull $IMAGE_REFERENCE

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

echo "Old container: $old_container"
echo "New container: $new_container"
echo "New port: $new_port"

# Run the new container
echo "Running new container: $new_container"
docker run -d --name $new_container \
  --env-file ~/caho.env \
  -p $new_port:8080 $IMAGE_REFERENCE

# Wait for the new container to start up
echo "Waiting for the new container to start up..."
sleep 10

# Stop and remove the old container
echo "Stopping old container: $old_container"
docker stop $old_container

echo "Removing old container: $old_container"
docker rm $old_container

# Reload Nginx to update the upstream list
echo "Reloading Nginx"
sudo systemctl reload nginx

echo "Deployment completed successfully."
