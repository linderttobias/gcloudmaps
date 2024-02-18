## About

A Flask-based API for managing mindmaps, with support for Google OAuth2 authentication and Firestore database operations.
Simple Flask backend.

### Features

- User authentication using Google OAuth2 tokens.
- CRUD operations on mindmaps stored in Firestore.

### API Endpoints
- GET /list: Retrieves a list of mindmaps associated with a user user.
- GET /mindmaps/<mindmap>: Retrieves a specific mindmap for a user.
- POST /mindmaps/<mindmap>: Adds a new mindmap or updates a existing one for an user user.
- DELETE /mindmaps/<mindmap>: Deletes a specific mindmap for a user user.

## Installation 

```bash
pyenv virtualenv 3.11.1 contentapi
pyenv local contentapi

pip install -r requirements.txt
```



## Usage

### Authorization

The application uses Google Cloud SDK and requires credentials to be set to run successfull. One method to do so is by invoking:

`gcloud auth application-default login`

Set Project for Firestore if different from Cloud Run Env:
`gcloud config set project <YOURPROJECT>`

### Local Development

`pyenv local contentapi`

You can start the application either in development mode with flask
or test it with the gunicorn server:


`flask run --port 3001`  
 or  
`gunicorn --bind :3001 --workers 1 --threads 8 --timeout 0 --log-level=debug app:app`


### Containerization & Cloud Run

Build and push to Artifact Registry:
```bash
docker build -t contentapi .
docker tag contentapi <YOUR-REGISTRY>/backend:<YOURTAG>
docker push <YOUR-REGISTRY>/backend:<YOURTAG>
```

Deploy new Cloud Run Revision:

```bash
gcloud run services list
gcloud run services describe <YOUR-SERVICE> --format export > service.yaml
```

Now update you Service (Adjust imgage tag etc ..) and deploy:
```bash
gcloud run services replace service.yaml
```

