# s3_object

## How to use this module:

### aws s3 object module usage with the required input variables:
```terraform
module "s3_object" {
  source         = "../"
  prefix_company = "ch"
  prefix_region  = "usw2"
  application    = "recordings"
  env            = "sandbox"
  create_object  = true
  bucket         = "cla-test"
  key            = "test_key"
}

```

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | >= 1.3.0, < 2.0.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 5.27 |
| <a name="requirement_external"></a> [external](#requirement\_external) | >= 2.3.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_external"></a> [external](#provider\_external) | 2.3.4 |

## Modules

| Name | Source | Version |
|------|--------|---------|
| <a name="module_s3_object"></a> [s3\_object](#module\_s3\_object) | git@github.com:Clover-Health-1/ccaas-terraform-modules.git//terraform-aws-s3-bucket/modules/object | main |

## Resources

| Name | Type |
|------|------|
| [external_external.env](https://registry.terraform.io/providers/hashicorp/external/latest/docs/data-sources/external) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_acl"></a> [acl](#input\_acl) | The canned ACL to apply. Valid values are private, public-read, public-read-write, aws-exec-read, authenticated-read, bucket-owner-read, and bucket-owner-full-control. Defaults to private. | `string` | `null` | no |
| <a name="input_application"></a> [application](#input\_application) | The application name of the rds, will be appended with the company, env and region to form a rds name. | `string` | n/a | yes |
| <a name="input_bucket"></a> [bucket](#input\_bucket) | The name of the bucket to put the file in. Alternatively, an S3 access point ARN can be specified. | `string` | `""` | no |
| <a name="input_bucket_key_enabled"></a> [bucket\_key\_enabled](#input\_bucket\_key\_enabled) | Whether or not to use Amazon S3 Bucket Keys for SSE-KMS. | `bool` | `null` | no |
| <a name="input_cache_control"></a> [cache\_control](#input\_cache\_control) | Specifies caching behavior along the request/reply chain. | `string` | `null` | no |
| <a name="input_content"></a> [content](#input\_content) | Literal string value to use as the object content, which will be uploaded as UTF-8-encoded text. | `string` | `null` | no |
| <a name="input_content_base64"></a> [content\_base64](#input\_content\_base64) | Base64-encoded data that will be decoded and uploaded as raw bytes for the object content. This allows safely uploading non-UTF8 binary data, but is recommended only for small content such as the result of the gzipbase64 function with small text strings. For larger objects, use source to stream the content from a disk file. | `string` | `null` | no |
| <a name="input_content_disposition"></a> [content\_disposition](#input\_content\_disposition) | Specifies presentational information for the object. | `string` | `null` | no |
| <a name="input_content_encoding"></a> [content\_encoding](#input\_content\_encoding) | Specifies what content encodings have been applied to the object and thus what decoding mechanisms must be applied to obtain the media-type referenced by the Content-Type header field. | `string` | `null` | no |
| <a name="input_content_language"></a> [content\_language](#input\_content\_language) | The language the content is in e.g. en-US or en-GB. | `string` | `null` | no |
| <a name="input_content_type"></a> [content\_type](#input\_content\_type) | A standard MIME type describing the format of the object data, e.g. application/octet-stream. All Valid MIME Types are valid for this input. | `string` | `null` | no |
| <a name="input_create_object"></a> [create\_object](#input\_create\_object) | Whether object should be created | `bool` | `false` | no |
| <a name="input_env"></a> [env](#input\_env) | Environment name | `string` | n/a | yes |
| <a name="input_etag"></a> [etag](#input\_etag) | Used to trigger updates. This attribute is not compatible with KMS encryption, kms\_key\_id or server\_side\_encryption = "aws:kms". | `string` | `null` | no |
| <a name="input_file_source"></a> [file\_source](#input\_file\_source) | The path to a file that will be read and uploaded as raw bytes for the object content. | `string` | `null` | no |
| <a name="input_force_destroy"></a> [force\_destroy](#input\_force\_destroy) | Allow the object to be deleted by removing any legal hold on any object version. Default is false. This value should be set to true only if the bucket has S3 object lock enabled. | `bool` | `false` | no |
| <a name="input_key"></a> [key](#input\_key) | The name of the object once it is in the bucket. | `string` | `""` | no |
| <a name="input_kms_key_id"></a> [kms\_key\_id](#input\_kms\_key\_id) | Amazon Resource Name (ARN) of the KMS Key to use for object encryption. If the S3 Bucket has server-side encryption enabled, that value will automatically be used. If referencing the aws\_kms\_key resource, use the arn attribute. If referencing the aws\_kms\_alias data source or resource, use the target\_key\_arn attribute. Terraform will only perform drift detection if a configuration value is provided. | `string` | `null` | no |
| <a name="input_lob"></a> [lob](#input\_lob) | The lob name of the rds, will be appended with the company, lob, env and region to form a rds name | `string` | n/a | yes |
| <a name="input_metadata"></a> [metadata](#input\_metadata) | A map of keys/values to provision metadata (will be automatically prefixed by x-amz-meta-, note that only lowercase label are currently supported by the AWS Go API). | `map(string)` | `{}` | no |
| <a name="input_object_lock_legal_hold_status"></a> [object\_lock\_legal\_hold\_status](#input\_object\_lock\_legal\_hold\_status) | The legal hold status that you want to apply to the specified object. Valid values are ON and OFF. | `string` | `null` | no |
| <a name="input_object_lock_mode"></a> [object\_lock\_mode](#input\_object\_lock\_mode) | The object lock retention mode that you want to apply to this object. Valid values are GOVERNANCE and COMPLIANCE. | `string` | `null` | no |
| <a name="input_object_lock_retain_until_date"></a> [object\_lock\_retain\_until\_date](#input\_object\_lock\_retain\_until\_date) | The date and time, in RFC3339 format, when this object's object lock will expire. | `string` | `null` | no |
| <a name="input_override_default_tags"></a> [override\_default\_tags](#input\_override\_default\_tags) | Ignore provider default\_tags. S3 objects support a maximum of 10 tags. | `bool` | `false` | no |
| <a name="input_prefix_company"></a> [prefix\_company](#input\_prefix\_company) | The prefix company of the rds, will be appended with the company, lob, env and region to form a rds name | `string` | n/a | yes |
| <a name="input_prefix_region"></a> [prefix\_region](#input\_prefix\_region) | The prefix region of the rds , will be appended with the company, lob, env and region to form a acm name. | `string` | n/a | yes |
| <a name="input_server_side_encryption"></a> [server\_side\_encryption](#input\_server\_side\_encryption) | Specifies server-side encryption of the object in S3. Valid values are "AES256" and "aws:kms". | `string` | `null` | no |
| <a name="input_source_hash"></a> [source\_hash](#input\_source\_hash) | Triggers updates like etag but useful to address etag encryption limitations. Set using filemd5("path/to/source") (Terraform 0.11.12 or later). (The value is only stored in state and not saved by AWS.) | `string` | `null` | no |
| <a name="input_storage_class"></a> [storage\_class](#input\_storage\_class) | Specifies the desired Storage Class for the object. Can be either STANDARD, REDUCED\_REDUNDANCY, ONEZONE\_IA, INTELLIGENT\_TIERING, GLACIER, DEEP\_ARCHIVE, or STANDARD\_IA. Defaults to STANDARD. | `string` | `null` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | A map of tags to assign to the object. | `map(string)` | `{}` | no |
| <a name="input_website_redirect"></a> [website\_redirect](#input\_website\_redirect) | Specifies a target URL for website redirect. | `string` | `null` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_s3_object_etag"></a> [s3\_object\_etag](#output\_s3\_object\_etag) | The ETag generated for the object (an MD5 sum of the object content). |
| <a name="output_s3_object_id"></a> [s3\_object\_id](#output\_s3\_object\_id) | The key of S3 object |
| <a name="output_s3_object_version_id"></a> [s3\_object\_version\_id](#output\_s3\_object\_version\_id) | A unique version ID value for the object, if bucket versioning is enabled. |
<!-- END_TF_DOCS -->
