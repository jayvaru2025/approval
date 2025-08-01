locals {
  # Custom locals.
  attach_policy = contains(keys(var.attach), "policy") ? var.attach.policy : false

  grant = [
    {
      type       = "CanonicalUser"
      permission = "FULL_CONTROL"
      id         = data.aws_canonical_user_id.current.id
    },
    {
      type       = "CanonicalUser"
      permission = "FULL_CONTROL"
      id         = data.aws_cloudfront_log_delivery_canonical_user_id.cloudfront.id
    },
    {
      type       = "Group"
      permission = "WRITE"
      uri        = "http://acs.amazonaws.com/groups/s3/LogDelivery"
    },
    {
      type       = "Group"
      permission = "READ_ACP"
      uri        = "http://acs.amazonaws.com/groups/s3/LogDelivery"
    }
  ]
}
