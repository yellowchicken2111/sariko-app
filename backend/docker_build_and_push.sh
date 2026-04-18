#!/bin/bash
GIT_SHA=$(git rev-parse --short HEAD)
VERSION="v1.0.0"

# docker login
cat /app/Jack/sariko-app/backend/src/envs/.docker-creds | docker login --username sariko --password-stdin

docker build -t sariko-backend:$VERSION .

docker tag sariko-backend:$VERSION sariko/sariko-backend:latest
docker tag sariko-backend:$VERSION sariko/sariko-backend:$VERSION
docker tag sariko-backend:$VERSION sariko/sariko-backend:$GIT_SHA

# docker push 
docker push sariko/sariko-backend:latest 2>&1
docker push sariko/sariko-backend:$VERSION 2>&1
docker push sariko/sariko-backend:$GIT_SHA 2>&1

#
# docker stop bridgeai-backend && docker rm bridgeai-backend
# docker compose up -d