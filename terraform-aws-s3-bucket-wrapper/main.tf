module "s3_bucket" {
  source                                   = "git@github.com:jayvaru2025/approval.git//terraform-aws-s3-bucket?ref=main"
  bucket                                   = var.bucket_name
  acl                                      = var.enable_grant == true ? null : var.acl
  control_object_ownership                 = true
  grant                                    = var.enable_grant == true ? local.grant : var.grant
  object_ownership                         = var.object_ownership
  force_destroy                            = var.force_destroy
  versioning                               = var.versioning_configuration
  server_side_encryption_configuration     = var.encryption_configuration
  lifecycle_rule                           = var.lifecycle_rules
  cors_rule                                = var.cors_rules
  website                                  = var.website_configuration
  create_bucket                            = var.create_bucket
  attach_policy                            = local.attach_policy
  policy                                   = local.attach_policy && var.custom_policy_document != null ? var.custom_policy_document : null
  block_public_acls                        = var.public_acl_configuration != null ? lookup(var.public_acl_configuration, "block_public_acls", true) : true
  block_public_policy                      = var.public_acl_configuration != null ? lookup(var.public_acl_configuration, "block_public_policy", true) : true
  ignore_public_acls                       = var.public_acl_configuration != null ? lookup(var.public_acl_configuration, "ignore_public_acls", true) : true
  restrict_public_buckets                  = var.public_acl_configuration != null ? lookup(var.public_acl_configuration, "restrict_public_buckets", true) : true
  attach_deny_insecure_transport_policy    = lookup(var.attach, "deny_insecure_transport_policy", false)
  attach_access_log_delivery_policy        = lookup(var.attach, "access_log_delivery_policy", false)
  attach_analytics_destination_policy      = lookup(var.attach, "analytics_destination_policy", false)
  attach_deny_incorrect_encryption_headers = lookup(var.attach, "deny_incorrect_encryption_headers", false)
  attach_deny_incorrect_kms_key_sse        = lookup(var.attach, "deny_incorrect_kms_key_sse", false)
  attach_elb_log_delivery_policy           = lookup(var.attach, "elb_log_delivery_policy", false)
  attach_inventory_destination_policy      = lookup(var.attach, "inventory_destination_policy", false)
  attach_lb_log_delivery_policy            = lookup(var.attach, "lb_log_delivery_policy", false)
  attach_public_policy                     = lookup(var.attach, "public_policy", true)
  attach_require_latest_tls_policy         = lookup(var.attach, "require_latest_tls_policy", false)
  attach_deny_unencrypted_object_uploads   = lookup(var.attach, "deny_unencrypted_object_uploads", false)
  expected_bucket_owner                    = data.aws_caller_identity.current.account_id
  logging = var.logging_target_bucket != null ? {
    target_bucket = var.logging_target_bucket
    target_prefix = "${var.bucket_name}/logs/"
  } : {}
  tags = merge(var.tags, { "map-migrated" = "123456" })
}

module "s3-bucket_notification" {
  source               = "git@github.com:jayvaru2025/approval.git//terraform-aws-s3-bucket/modules/notification?ref=main"
  count                = var.lambda_trigger ? 1 : 0
  bucket               = var.bucket_name
  lambda_notifications = lookup(var.notification_configuration, "lambda", {})
  sqs_notifications    = lookup(var.notification_configuration, "sqs", {})
  sns_notifications    = lookup(var.notification_configuration, "sns", {})
  create_sns_policy    = lookup(var.create, "sns_policy", true)
  create_sqs_policy    = lookup(var.create, "sqs_policy", true)
}

module "s3_bucket_policy" {
  source    = "git@github.com:jayvaru2025/approval.git//terraform-aws-s3-bucket/modules/cloudfront-access-policy?ref=main"
  count     = var.cloudfront_policy ? 1 : 0
  bucket_id = var.bucket_name
  policy    = var.policy
}