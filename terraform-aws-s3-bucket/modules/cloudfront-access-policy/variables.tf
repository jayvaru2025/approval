variable "bucket_id" {
  description = "Controls if S3 bucket should be created"
  type        = string
}

variable "policy" {
  description = "Attach S3 bucket policy"
  type        = any
}