#!/usr/bin/env sh


./../rancher-compose --project-name Node-and-mongo-tutorial \
    --url http://192.168.99.100:8080/v1/projects/1a5 \
    --access-key CD52CAD11C40D03671B4 \
    --secret-key 3f4QH85L1nPvmE5bdTQF9D15vXDkjkyNJKu8L6nT \
    -f docker-compose.yml \
    --verbose up \
    -d --force-upgrade \
    --confirm-upgrade
