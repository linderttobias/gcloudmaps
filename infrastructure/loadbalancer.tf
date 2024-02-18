


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

resource "google_compute_backend_service" "api" {
  name                  = "backend-service-api"
  load_balancing_scheme = "EXTERNAL_MANAGED"

  backend {
    group = google_compute_region_network_endpoint_group.cloudrun_neg_api.id
  }
}

resource "google_compute_url_map" "default" {
  name        = "gcloudmaps-lb-http-https"
  description = "Url Map for redirecting"

  default_service = google_compute_backend_service.default.id

  host_rule {
    hosts = [
      "dev.gcloudmaps.com",
    ]
    path_mather = "dev"
  }

  host_rule {
    hosts        = ["gcloudmaps.com"]
    path_matcher = "main"
  }

    path_matcher {
    name            = "dev"
    default_service = google_compute_backend_service.default.self_link

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.api.self_link
    }
  }

  path_matcher {
    name            = "main"
    default_service = google_compute_backend_service.default.self_link

    path_rule {
      paths   = ["/api/*"]
      service = google_compute_backend_service.api.self_link
    }
  }

}


resource "google_compute_url_map" "http-redirect" {
  name = "http-redirect"

  default_url_redirect {
    redirect_response_code = "MOVED_PERMANENTLY_DEFAULT" // 301 redirect
    strip_query            = false
    https_redirect         = true // this is the magic
  }

}

resource "google_compute_target_https_proxy" "default" {
  name             = "https-proxy"
  url_map          = google_compute_url_map.default.id
  ssl_certificates = [google_compute_managed_ssl_certificate.ssl.id]
}


resource "google_compute_target_http_proxy" "default" {
  name    = "http-proxy"
  url_map = google_compute_url_map.http-redirect.self_link
}


resource "google_compute_global_forwarding_rule" "https_forward" {
  name                  = "https-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "443-443"
  target                = google_compute_target_https_proxy.default.id
  ip_address            = google_compute_global_address.default.id
}


resource "google_compute_global_forwarding_rule" "http_forward" {
  name                  = "http-forwarding-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  target                = google_compute_target_http_proxy.default.self_link
  ip_address            = google_compute_global_address.default.id
  port_range            = "80"
}

resource "google_compute_region_network_endpoint_group" "cloudrun_neg" {
  name                  = "cloudrun-neg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_v2_service.frontend.name
  }
}

resource "google_compute_region_network_endpoint_group" "cloudrun_neg_api" {
  name                  = "cloudrun-neg-api"
  network_endpoint_type = "SERVERLESS"
  region                = var.region
  cloud_run {
    service = google_cloud_run_v2_service.backend.name
  }
}