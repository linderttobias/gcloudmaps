## Gcloudmaps Application (React + NodeJs)

React:  
`cd frontend && npm run start  

NodeJs:  
`node ./backend/server.js 



#### Docker

```bash
docker build -t react-node
docker tag react-node europe-west1-docker.pkg.dev/gcloudmaps/container/app
docker push europe-west1-docker.pkg.dev/gcloudmaps/container/app
```