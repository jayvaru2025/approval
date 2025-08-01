# Resource specific variables.
variable "bucket_name" {
  description = "The specific name of the S3 bucket. If left empty, a name may be generated based on other variables."
  type        = string
  default     = ""
}

variable "force_destroy" {
  type        = bool
  default     = false
  description = "If true, all objects in the bucket will be deleted when the bucket itself is deleted."
}

variable "versioning_configuration" {
  type        = any
  default     = {}
  description = "Configuration related to enabling versioning, which retains multiple versions of an object within the bucket."
}

variable "acl" {
  description = "The access control list (ACL) policy for the bucket (e.g., private, public-read)."
  type        = string
  default     = "private"
}

variable "encryption_configuration" {
  description = "Configuration related to encryption."
  type        = any
  default     = {}
}

variable "logging_target_bucket" {
  description = "The name of the bucket where access logs will be stored."
  type        = string
  default     = null
}

variable "public_acl_configuration" {
  description = "Configuration related to public ACL."
  type        = any
  default     = null
}

variable "lifecycle_rules" {
  description = "A list of lifecycle management rules for objects in the bucket, such as expiration or transition to another storage class."
  type        = any
  default     = []
}

variable "website_configuration" {
  description = "S3 static website hosting configuration."
  type        = any
  default     = {}
}

variable "cors_rules" {
  description = "CORS rules for the S3 bucket."
  type        = any
  default     = []
}

variable "custom_policy_document" {
  description = "Custom IAM policy document for the S3 bucket in object format."
  type        = string
  default     = null
}

variable "attach" {
  description = "Configuration settings for attaching the resources."
  type        = any
  default     = {}
}

variable "notification_configuration" {
  description = "Configuration settings for S3 notifications."
  type        = any
  default     = {}
}

variable "create" {
  description = "Configuration settings for resource creation."
  type        = any
  default     = {}
}

variable "enable_grant" {
  description = "Set to true to enable ACL policy grant."
  type        = bool
  default     = false
}

variable "grant" {
  description = "An ACL policy grant. Conflicts with `acl`."
  type        = any
  default     = []
}

variable "object_ownership" {
  description = "Specifies the object ownership controls on the bucket. Valid values: BucketOwnerPreferred or ObjectWriter."
  type        = string
  default     = "BucketOwnerEnforced"
}


# Add your variable declarations below

variable "lambda_trigger" {
  description = "Whether to enable lambda trigger for S3 bucket notifications"
  type        = bool
  default     = false
}

variable "cloudfront_policy" {
  description = "Whether to enable the CloudFront access policy for the S3 bucket"
  type        = bool
  default     = false
}

variable "tags" {
  description = "A mapping of tags to assign to all resources."
  type        = any
  default     = {}
}

variable "create_bucket" {
  description = "Controls if S3 bucket should be created"
  type        = bool
  default     = true
}

variable "policy" {
  description = "Attach S3 bucket policy"
  type        = any
  default     = false
}
