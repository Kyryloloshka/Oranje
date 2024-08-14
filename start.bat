@echo off

docker-compose up -d

cd api
start dotnet watch

cd ..
cd front
start ng serve