resource "google_artifact_registry_repository" "gcloudmaps" {
  location      = var.region
  repository_id = "gcloudmaps"
  description   = "Repository for Docker Image for gcloudmaps"
  format        = "DOCKER"
  labels        = var.labels
}



resource "google_cloud_run_v2_service" "frontend" {
  name     = "gcloudmaps-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/frontend"
      ports {
        container_port = 3000
      }
    }
  }

}

resource "google_cloud_run_v2_service" "backend" {
  name     = "gcloudmaps-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER"


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/backend"
      ports {
        container_port = 3001
      }
    }
  }

}