#!/bin/bash
# install tools
sudo apt update && sudo apt upgrade
sudo apt-get install -y net-tools
sudo apt install -y imagemagick

# choose git branch
read -p "Enter the branch default is master: " doBranch
doBranch=${doBranch:-master}
echo $doBranch

# get aws ip
myAwsIp=$(curl http://checkip.amazonaws.com)
dataUrl="http://${myAwsIp}:3001"
echo ${dataUrl}

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install --lts

# install redis
sudo apt install -y redis-server
sudo awk -i inplace '{sub("supervised no","supervised systemd")}1' /etc/redis/redis.conf
sudo systemctl restart redis.service

# install mongodb
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# install pm2 and start project
cd ~
sudo apt install -y git
npm install pm2@latest -g
git clone -b $doBranch https://github.com/Tianqi-Yao/CS554_Final_Project_2021Fall.git

cd CS554_Final_Project_2021Fall
cd server
npm install
pm2 start --name server npm -- start

cd ../client
npm install
awk -i inplace -v awsIP="${dataUrl}" '{sub("http://localhost:3001",awsIP)}1' ./src/config/awsUrl.js

pm2 start --name client npm -- start

cd ~
pm2 ps