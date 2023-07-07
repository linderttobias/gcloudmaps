


resource "google_compute_managed_ssl_certificate" "ssl" {
  name = "gcloudmaps-ssl"

  managed {
    domains = [var.domain]
  }
}


resource "google_compute_global_address" "default" {
  name       = "lb-ipv4-1"
  ip_version = "IPV4"
}

resource "google_compute_backend_service" "default" {
  name                  = "backend-service"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg.id
  }

}

resource "google_compute_url_map" "default" {
  name        = "gcloudmaps-lb-http-https"
  description = "a description"

  default_service = google_compute_backend_service.default.id

}

resource "google_compute_target_https_proxy" "default" {
  name             = "test-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl.id]
}

resource "google_compute_global_forwarding_rule" "default" {
  name                  = "https-content-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443-443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.default.id
}


resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "cloudrun-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region_eu
  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}