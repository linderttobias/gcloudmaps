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