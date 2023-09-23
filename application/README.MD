## Gcloudmaps Application (React + NodeJs)

React:  
`cd frontend && npm run start  

NodeJs:  
`node ./backend/server.js 

## Installation

### Prepare Environment

```shell
sudo apt-get update
curl -fsSl https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install npm
```

Test

```shell
node -v should be 18.XX
npm -v should be 9.XX
```

### Set-up Applications

```shell
cd frontend & npm install
cd backend & npm install
```


#### Docker

```shell
docker build -t react-node
docker tag react-node europe-west1-docker.pkg.dev/gcloudmaps/container/app
docker push europe-west1-docker.pkg.dev/gcloudmaps/container/app
```