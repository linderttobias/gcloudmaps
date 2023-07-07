variable "project" {
  type        = string
  description = "The ID of the GCP project to use."
}

variable "region_eu" {
  type        = string
  description = "The main GCP region to use."
}

variable "region_us" {
  type        = string
  description = "The second GCP region to use."
}

variable "zone_eu" {
  type        = string
  description = "The main GCP zone to use."
}

variable "zone_us" {
  type        = string
  description = "The second GCP zone to use."
}


variable "labels" {
  type        = map(any)
  description = "Commonly applied labels where possible"
}


variable "domain" {
  type        = string
  description = "Domain name used for LB and SSL"
}