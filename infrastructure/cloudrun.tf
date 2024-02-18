resource "google_artifact_registry_repository" "gcloudmaps" {
  location      = var.region
  repository_id = "gcloudmaps"
  description   = "Repository for Docker Image for gcloudmaps"
  format        = "DOCKER"
  labels        = var.labels
}



resource "google_cloud_run_v2_service" "frontend-production" {
  name     = "gcloudmaps-frontend-production"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/frontend-production"
      ports {
        container_port = 3000
      }
    }
  }

}

resource "google_cloud_run_v2_service" "backend-production" {
  name     = "gcloudmaps-backend-production"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 2
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/backend-production"
      ports {
        container_port = 3001
      }
    }
  }

}


resource "google_cloud_run_v2_service" "frontend-development" {
  name     = "gcloudmaps-frontend-development"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/frontend-development"
      ports {
        container_port = 3000
      }

      env {
        name  = "FOO"
        value = "bar"
      }
    }
  }

}

resource "google_cloud_run_v2_service" "backend-development" {
  name     = "gcloudmaps-backend-development"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }


  template {

    labels = var.labels

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    service_account = google_service_account.umsa-cloudrun.email

    containers {
      image = "europe-west1-docker.pkg.dev/gcloudmaps/gcloudmaps/backend-development"
      ports {
        container_port = 3001
      }
    }
  }

}