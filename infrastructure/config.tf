
terraform {
  required_version = "= 1.7.1"

  backend "gcs" {
    bucket = "gcloudmaps-terraform-state"
    prefix = "infrastructure"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.63.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "4.63.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}


provider "google-beta" {
  project = var.project
  region  = var.region
  zone    = var.zone
}