
terraform {
  required_version = "= 1.4.5"

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
  region  = var.region_eu
  zone    = var.zone_eu
}


provider "google-beta" {
  project = var.project
  region  = var.region_eu
  zone    = var.zone_eu
}