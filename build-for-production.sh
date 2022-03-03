#!/bin/sh
. $HOME/.nvm/nvm.sh
date=$(date "+%Y%m%d%H%M%S");
echo $date;
cd /tmp;
git clone https://github.com/miterfrants/itemhub itemhub-$date;
cd itemhub-$date/website;

# website
cp /var/project/itemhub/website/src/config.prod.js ./src/config.prod.js;
nvm use 16 && npm i && NODE_ENV=prod FORCE_UPDATE=false npm run swim-build;
tar -zcvf itemhub.website.tar.gz ./dist;
cp ./itemhub.website.tar.gz /var/project/itemhub/static/upload;

# dashboard
cd ../dashboard;
nvm use 16 && npm i && npm run build;
tar -zcvf itemhub.dashboard.tar.gz ./dist;
cp ./itemhub.dashboard.tar.gz /var/project/itemhub/static/upload;

# api
cd ../api;
sudo docker build -t asia-east1-docker.pkg.dev/sapiens-240508/itemhub/itemhub-web-server ./;
sudo docker push asia-east1-docker.pkg.dev/sapiens-240508/itemhub/itemhub-web-server;

rm -rf /tmp/itemhub-$date;