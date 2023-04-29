resource "google_cloudbuild_trigger" "frontend-prod" {
  location = var.region
  name     = "build-deploy-gcloudmaps-prod"
  service_account = google_service_account.umsa-cloudbuild.id
  filename = "deployment/frontend.yaml"

  github {
    owner = "hunderttausendwatt"
    name  = "gcloudmaps"
    push {
      branch = "^main$"
    }
  }

}