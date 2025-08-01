module "s3_bucket" {
  source                   = "git@github.com:jayvaru2025/approval.git//terraform-aws-s3-bucket-wrapper?ref=main"
  bucket_name              = format("%s-s3-bucket-%s-%s", var.company_prefix, local.region_prefix, var.env)
  acl                      = null
  public_acl_configuration = null
  versioning_configuration = { status = true, mfa_delete = false }
  tags = local.tags
}

