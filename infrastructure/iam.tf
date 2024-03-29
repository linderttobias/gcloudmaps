resource "google_service_account" "umsa-cloudrun" {
  account_id  = "gcloudmaps-cloudrun-umsa"
  description = "user-managed Service Account to run Cloud Run services"
}

resource "google_service_account" "umsa-deployment" {
  account_id  = "deployment-github-umsa"
  description = "user-managed Service Account for the build and deployment (backend and frontend) with github actions"
}

# UMSA for Terraform. Roles are added manually
resource "google_service_account" "umsa-tf-plan" {
  account_id  = "tf-plan-umsa"
  description = "Service Account for Terraform Plan on GitHub Actions"
}

# UMSA for Terraform. Roles are added manually
resource "google_service_account" "umsa-tf-apply" {
  account_id  = "tf-apply-umsa"
  description = "Service Account for Terraform Apply on GitHub Actions"
}

resource "google_cloud_run_service_iam_binding" "frontend-production" {
  location = google_cloud_run_v2_service.frontend-production.location
  service  = google_cloud_run_v2_service.frontend-production.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}


resource "google_cloud_run_service_iam_binding" "backend-production" {
  location = google_cloud_run_v2_service.backend-production.location
  service  = google_cloud_run_v2_service.backend-production.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_cloud_run_service_iam_binding" "frontend-development" {
  location = google_cloud_run_v2_service.frontend-development.location
  service  = google_cloud_run_v2_service.frontend-development.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}


resource "google_cloud_run_service_iam_binding" "backend-development" {
  location = google_cloud_run_v2_service.backend-development.location
  service  = google_cloud_run_v2_service.backend-development.name
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
  service  = google_cloud_run_v2_service.frontend-production.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}

resource "google_cloud_run_service_iam_member" "member-backend" {
  location = var.region
  project  = var.project
  service  = google_cloud_run_v2_service.backend-production.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}



resource "google_cloud_run_service_iam_member" "member-frontend-development" {
  location = var.region
  project  = var.project
  service  = google_cloud_run_v2_service.frontend-development.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}

resource "google_cloud_run_service_iam_member" "member-backend-development" {
  location = var.region
  project  = var.project
  service  = google_cloud_run_v2_service.backend-development.name
  role     = "roles/run.admin"
  member   = "serviceAccount:${google_service_account.umsa-deployment.email}"
}