## Frontend Application (React)

This directory contains the React-based frontend application for gcloudmaps.com. It provides the user interface for browsing and interacting with the Google Cloud services mind map.

### Key Features & Libraries

*   **Interactive Mind Map:** Built with React Flow to display and navigate the Google Cloud services.
*   **State Management:** Uses Redux for managing application state.
*   **Styling:** Styled with standard CSS and potentially CSS-in-JS solutions if present.

### Local Development

To run the frontend application locally for development:

1.  **Navigate to the frontend directory:**
    ```bash
    cd application/frontend
    ```
2.  **Install dependencies:**
    If you haven't already, install the necessary Node.js packages.
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run start
    ```
    This will typically open the application in your default web browser at `http://localhost:3000`. The server will automatically reload when you make changes to the code.

### Building the Frontend

To create a production build of the frontend:

1.  **Navigate to the frontend directory:**
    ```bash
    cd application/frontend
    ```
2.  **Run the build script:**
    ```bash
    npm run build
    ```
    This command will generate a `build` directory containing the optimized static assets for the frontend. These assets are then served by the web server (e.g., Nginx) as defined in `nginx.conf` and the `Dockerfile`.

### Dockerization

The frontend application is containerized using Docker. The `Dockerfile` and `nginx.conf` in this directory are used to build the frontend image and serve its static content.

To build the Docker image locally (example):
```bash
docker build -t gcloudmaps-frontend .
```

This image is then pushed to a container registry (like Google Artifact Registry) as part of the CI/CD pipeline.
