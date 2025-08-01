output "bucket_arn" {
  description = "The ARN of the S3 bucket."
  value       = one(module.s3_bucket[*].s3_bucket_arn)
}

output "bucket_domain_name" {
  description = "The domain name of the S3 bucket."
  value       = one(module.s3_bucket[*].s3_bucket_bucket_domain_name)
}

output "bucket_id" {
  description = "The ID of the S3 bucket."
  value       = one(module.s3_bucket[*].s3_bucket_id)
}

output "bucket_region" {
  description = "The region the S3 bucket is created in."
  value       = one(module.s3_bucket[*].s3_bucket_region)
}
