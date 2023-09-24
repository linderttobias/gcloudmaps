resource "google_service_account" "umsa-cloudrun" {
  account_id   = "gcloudmaps-cloudrun-umsa"
  display_name = "User-managed Service Account for the Cloud Run"
}


resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}


resource "google_cloud_run_service_iam_binding" "backend" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}


resource "google_artifact_registry_repository_iam_member" "member" {
  project    = google_artifact_registry_repository.gcloudmaps.project
  location   = google_artifact_registry_repository.gcloudmaps.location
  repository = google_artifact_registry_repository.gcloudmaps.name
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.umsa-cloudrun.email}"
}


# ForCloud Build
# User (roles/iam.serviceAccountUser)
#Logs Writer (roles/logging.logWriter) role
#Artifact Registry Create-on-push Writer (roles/artifactregistry.createOnPushWriter) role 
# act as the Runtime Service Account of your Cloud Run service.


resource "google_service_account" "umsa-deployment" {
  account_id   = "deployment-github-umsa"
  display_name = "User-managed Service Account for the deployment with github actions"
}

# Required to Deployment Pipeline can assign Cloud Run SA to Service
resource "google_service_account_iam_member" "user-account-iam" {
  service_account_id = google_service_account.umsa-cloudrun.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.umsa-deployment.email}"
}

resource "google_artifact_registry_repository_iam_member" "member-cloudbuild" {
  project    = google_artifact_registry_repository.gcloudmaps.project
  location   = google_artifact_registry_repository.gcloudmaps.location
  repository = google_artifact_registry_repository.gcloudmaps.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.umsa-deployment.email}"
}


resource "google_cloud_run_service_iam_member" "member-frontend" {
  location = var.region
  project  = var.project
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}

resource "google_cloud_run_service_iam_member" "member-backend" {
  location = var.region
  project  = var.project
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}