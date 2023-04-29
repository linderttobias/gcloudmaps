resource "google_cloudbuild_trigger" "frontend-prod" {
  location = var.region
  name     = "build-deploy-frontend-gcloudmaps-prod"
  service_account = google_service_account.umsa-cloudbuild.id
  filename = "deployment/frontend.yaml"

  github {
    owner = "hunderttausendwatt"
    name  = "gcloudmaps"
    push {
      branch = "^main$"
    }
  }
  
  included_files = ["application/frontend"]
}

resource "google_cloudbuild_trigger" "backend-prod" {
  location = var.region
  name     = "build-deploy-backend-gcloudmaps-prod"
  service_account = google_service_account.umsa-cloudbuild.id
  filename = "deployment/backend.yaml"

  github {
    owner = "hunderttausendwatt"
    name  = "gcloudmaps"
    push {
      branch = "^main$"
    }
  }
  
  included_files = ["application/backend"]
}