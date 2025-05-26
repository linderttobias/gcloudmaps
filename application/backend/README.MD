## About

This directory contains the Python Flask-based backend application for gcloudmaps.com. It serves as an API to manage mind map data, using Google OAuth2 for authentication and Firestore for database operations.

### Features

-   User authentication via Google OAuth2 tokens.
-   CRUD (Create, Read, Update, Delete) operations for mind maps stored in Google Firestore.

### API Endpoints

The following API endpoints are provided:

-   `GET /list`: Retrieves a list of mind maps associated with the authenticated user.
-   `GET /mindmaps/<mindmap_id>`: Retrieves a specific mind map for the authenticated user.
-   `POST /mindmaps/<mindmap_id>`: Adds a new mind map or updates an existing one for the authenticated user.
-   `DELETE /mindmaps/<mindmap_id>`: Deletes a specific mind map for the authenticated user.

## Installation

```bash
pyenv virtualenv 3.11.1 contentapi
pyenv local contentapi

pip install -r requirements.txt
```



## Usage

### Authorization

The application interacts with Google Cloud services and requires authentication. Ensure your environment is authenticated, for example, by using Application Default Credentials:

```bash
gcloud auth application-default login
```

If your Firestore database is in a different Google Cloud project than your Cloud Run environment, set the project explicitly:

```bash
gcloud config set project YOUR_GOOGLE_CLOUD_PROJECT_ID
```

### Local Development Setup

1.  **Activate Python Environment:**
    Ensure your `pyenv` environment (e.g., `contentapi`) is active:
    ```bash
    pyenv local contentapi
    ```

2.  **Run the Application:**
    You can run the backend using either the Flask development server or Gunicorn:

    *   **Flask Development Server:**
        ```bash
        flask run --port 3001
        ```
    *   **Gunicorn (for a more production-like setup):**
        ```bash
        gunicorn --bind :3001 --workers 1 --threads 8 --timeout 0 --log-level=debug app:app
        ```

### Containerization and Deployment

The backend is designed to be containerized with Docker and deployed to services like Google Cloud Run.

1.  **Build the Docker Image:**
    ```bash
    docker build -t gcloudmaps-backend .
    ```

2.  **Tag and Push to Artifact Registry:**
    Replace `YOUR_ARTIFACT_REGISTRY_REGION`, `YOUR_GOOGLE_CLOUD_PROJECT_ID`, and `YOUR_TAG` with appropriate values.
    ```bash
    docker tag gcloudmaps-backend YOUR_ARTIFACT_REGISTRY_REGION-docker.pkg.dev/YOUR_GOOGLE_CLOUD_PROJECT_ID/gcloudmaps/backend:YOUR_TAG
    docker push YOUR_ARTIFACT_REGISTRY_REGION-docker.pkg.dev/YOUR_GOOGLE_CLOUD_PROJECT_ID/gcloudmaps/backend:YOUR_TAG
    ```
    (Example: `europe-west1-docker.pkg.dev/my-gcp-project/gcloudmaps/backend:latest`)

3.  **Deploy to Cloud Run:**
    You can deploy to Cloud Run using the Google Cloud Console or the `gcloud` CLI. To update an existing service with a new image:
    ```bash
    gcloud run services update YOUR_CLOUD_RUN_SERVICE_NAME \
        --image=YOUR_ARTIFACT_REGISTRY_REGION-docker.pkg.dev/YOUR_GOOGLE_CLOUD_PROJECT_ID/gcloudmaps/backend:YOUR_TAG \
        --region=YOUR_CLOUD_RUN_REGION
    ```
    Alternatively, you can define your service in a `service.yaml` file and deploy it using:
    ```bash
    gcloud run services replace service.yaml
    ```
    Ensure your `service.yaml` points to the correct image tag.

