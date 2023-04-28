variable "project" {
  type        = string
  description = "The ID of the GCP project to use."
}

variable "region" {
  type        = string
  description = "The GCP region to use."
}

variable "zone" {
  type        = string
  description = "The GCP zone to use."
}


variable "labels" {
  type        = map(any)
  description = "Commonly applied labels where possible"
}


variable "domain" {
  type        = string
  description = "Domain name used for LB and SSL"
}