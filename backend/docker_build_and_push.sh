#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

GIT_SHA=$(git rev-parse --short HEAD)

# docker login: dùng env secret nếu có, không thì fallback về file cũ
if [ -n "${DOCKERHUB_TOKEN:-}" ]; then
    echo "$DOCKERHUB_TOKEN" | docker login --username "${DOCKERHUB_USERNAME:-sariko}" --password-stdin
else
    cat src/envs/.docker-creds | docker login --username sariko --password-stdin
fi

docker build --platform linux/amd64 -t sariko-backend:$GIT_SHA .

docker tag sariko-backend:$GIT_SHA sariko/sariko-backend:latest
docker tag sariko-backend:$GIT_SHA sariko/sariko-backend:$GIT_SHA

# docker push 
docker push sariko/sariko-backend:latest
docker push sariko/sariko-backend:$GIT_SHA

docker logout