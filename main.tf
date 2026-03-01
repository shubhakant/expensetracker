# Terraform Configuration for Google Cloud Storage Website Hosting

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

# 1. Update this with your actual Google Cloud Project ID
provider "google" {
  project = "expense-tracker-5702"
  region  = "asia-south1"
}

# 2. Define the exact name of your bucket (must be globally unique)
variable "bucket_name" {
  type    = string
  default = "expense-tracker-bucket-5702-mumbai"
}

# 3. Create the Google Cloud Storage Bucket
resource "google_storage_bucket" "website_bucket" {
  name          = var.bucket_name
  location      = "asia-south1"
  force_destroy = true # Allows Terraform to delete the bucket even if it contains files

  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 4. Make the bucket publicly readable
resource "google_storage_bucket_iam_binding" "public_rule" {
  bucket = google_storage_bucket.website_bucket.name
  role   = "roles/storage.objectViewer"
  members = [
    "allUsers",
  ]
}

# Grant Cloud Build service account write access to the new bucket
resource "google_storage_bucket_iam_member" "cloudbuild_deployer" {
  bucket = google_storage_bucket.website_bucket.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:cloud-build-deployer@expense-tracker-5702.iam.gserviceaccount.com"
}

# 5. Upload your website files
resource "google_storage_bucket_object" "index_html" {
  name         = "index.html"
  source       = "./index.html"
  content_type = "text/html"
  bucket       = google_storage_bucket.website_bucket.name
}

resource "google_storage_bucket_object" "style_css" {
  name         = "style.css"
  source       = "./style.css"
  content_type = "text/css"
  bucket       = google_storage_bucket.website_bucket.name
}

resource "google_storage_bucket_object" "script_js" {
  name         = "script.js"
  source       = "./script.js"
  content_type = "application/javascript"
  bucket       = google_storage_bucket.website_bucket.name
}

# 6. Output the live URL after applying
output "website_url" {
  value = "https://storage.googleapis.com/${google_storage_bucket.website_bucket.name}/index.html"
}
