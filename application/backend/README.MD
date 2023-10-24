### Installation 

```bash
pyenv virtualenv 3.11.1 content-api
pyenv local content-api

pip install -r requirements.txt
```



### Use

Development Server: 
```bash
flask run --port 3001
```


Docker:
```bash
docker build -t content-api .
docker run -p 3001 content-api
```
