#!/bin/sh
. $HOME/.nvm/nvm.sh
ENV="$NODE_ENV";

cd ./api
git pull origin master

sudo docker build -t homo-iot-api ./

if [ "$(sudo docker ps -q -f name=homo-iot-api)" ]; then
   sudo docker stop homo-iot-api
fi
if [ "$(sudo docker container ls -f name=homo-iot-api)" ]; then
   sudo docker rm homo-iot-api
fi
sudo docker run -d \
   -e ASPNETCORE_URLS=http://\*:8080 -e ASPNETCORE_ENVIRONMENT=prod \
   -p 8099:8080 \
   --name homo-iot-api \
   -v /var/project/homo-iot-hub/api/appsettings.json:/app/appsettings.json \
   -v /var/project/homo-iot-hub/api/secrets.json:/app/secrets.json \
   homo-iot-api

cd ../f2e
nvm use 16 && npm install && FORCE_UPDATE=false NODE_ENV=$ENV npm run swim-build