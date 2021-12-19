#!/bin/bash
# install tools
sudo apt update && sudo apt upgrade
sudo apt-get install -y net-tools
sudo apt install -y imagemagick
sudo apt install -y graphicsmagick

# choose git branch
read -r -p "Enter the branch default is master: " doBranch
doBranch=${doBranch:-master}

# get aws ip
myAwsIp=$(curl http://checkip.amazonaws.com)
dataUrl="http://${myAwsIp}:3001"

# install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 14.18.2

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
cd ~ || exit
sudo apt install -y git
npm install pm2@latest -g
git clone -b "$doBranch" https://github.com/Tianqi-Yao/CS554_Final_Project_2021Fall.git

cd CS554_Final_Project_2021Fall || exit
cd server || exit
npm install
mkdir public
pm2 start --name server npm -- start

cd ../client || exit
npm install
awk -i inplace -v awsIP="${dataUrl}" '{sub("http://localhost:3001",awsIP)}1' ./src/config/awsUrl.js

pm2 start --name client npm -- start

cd ~ || exit
pm2 ps