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
    -v /var/project/Homo.IotApi/appsettings.json:/app/appsettings.json \
    -v /var/project/Homo.IotApi/secrets.json:/app/secrets.json \
    homo-iot-api
