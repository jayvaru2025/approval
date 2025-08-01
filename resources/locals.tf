locals {
  file_hash_map = {
    "ch-telesales-security-profile.yaml" = filesha256("securityprofile_stack/ch-telesales-security-profile.yaml")
  }
  s3_cfn_objects_map = {
    "object1" = {
      key         = "${var.lob}/${local.region_prefix}/security-profile/ch-telesales-security-profile-${local.file_hash_map["ch-telesales-security-profile.yaml"]}.yaml"
      file_source = "securityprofile_stack/ch-telesales-security-profile.yaml"
    }
  }
  region_prefix_map = {
    "af-south-1"     = "afs1"
    "ap-east-1"      = "ape1"
    "ap-northeast-1" = "apne1"
    "ap-northeast-2" = "apne2"
    "ap-northeast-3" = "apne3"
    "ap-south-1"     = "aps1"
    "ap-south-2"     = "aps2"
    "ap-southeast-1" = "apse1"
    "ap-southeast-2" = "apse2"
    "ap-southeast-3" = "apse3"
    "ap-southeast-4" = "apse4"
    "ap-southeast-5" = "apse5"
    "ap-southeast-7" = "apse7"
    "ca-central-1"   = "cac1"
    "ca-west-1"      = "caw1"
    "cn-north-1"     = "cnn1"
    "cn-northwest-1" = "cnnw1"
    "eu-central-1"   = "euc1"
    "eu-central-2"   = "euc2"
    "eu-north-1"     = "eun1"
    "eu-south-1"     = "eus1"
    "eu-south-2"     = "eus2"
    "eu-west-1"      = "euw1"
    "eu-west-2"      = "euw2"
    "eu-west-3"      = "euw3"
    "il-central-1"   = "ilc1"
    "me-central-1"   = "mec1"
    "me-south-1"     = "mes1"
    "mx-central-1"   = "mxc1"
    "sa-east-1"      = "sae1"
    "us-east-1"      = "use1"
    "us-east-2"      = "use2"
    "us-gov-east-1"  = "usge1"
    "us-gov-west-1"  = "usgw1"
    "us-west-1"      = "usw1"
    "us-west-2"      = "usw2"
  }

  is_primary    = var.region == "us-east-1"
  region_prefix = local.region_prefix_map["${var.region}"]

  lambda_default_configurations = {
    handler                 = "lambda_function.lambda_handler"
    runtime                 = "python3.12"
    package                 = "../lambda_function/lambda_function.zip"
    timeout                 = 900
    memory_size             = 128
    ignore_source_code_hash = true
    tags                    = local.tags
  }

  tags = {
    lob        = var.lob
    company    = var.company
    env        = var.env
    repository = var.repo_url
    created_by = "Terraform"
    project    = var.project
    region     = var.region
  }

  key_statements = [
    {
      sid = "Enable Amazon Connect"
      actions = [
        "kms:Decrypt*"
      ]
      resources = ["*"]
      principals = [
        {
          type        = "Service"
          identifiers = ["connect.amazonaws.com"]
        }
      ]
    }
  ]

  instance_storage_configs = {
    CALL_RECORDINGS = {
      storage_type = "S3"
      s3_config = {
        bucket_name   = module.s3_call_recording.bucket_id
        bucket_prefix = "call_recordings"
        encryption_config = {
          encryption_type = "KMS"
          key_id          = module.common_aws_kms_key.key_arn
        }
      }
    }
    SCHEDULED_REPORTS = {
      storage_type = "S3"
      s3_config = {
        bucket_name   = module.s3_schedueled_report.bucket_id
        bucket_prefix = "scheduled_reports"
        encryption_config = {
          encryption_type = "KMS"
          key_id          = module.common_aws_kms_key.key_arn
        }
      }
    }
    AGENT_EVENTS = {
      storage_type = "KINESIS_STREAM"

      kinesis_stream_config = {
        stream_arn = module.kinesis.kinesis_stream_arn
      }
    }
    CONTACT_TRACE_RECORDS = {
      storage_type = "KINESIS_STREAM"
      kinesis_stream_config = {
        stream_arn = module.kinesis.kinesis_stream_arn
      }
    }
    MEDIA_STREAMS = {
      storage_type = "KINESIS_VIDEO_STREAM"

      kinesis_video_stream_config = {
        prefix                 = "kvs"
        retention_period_hours = 24

        encryption_config = {
          encryption_type = "KMS"
          key_id          = try(module.common_aws_kms_key.key_arn)
        }
      }
    }
  }
  lambda_iam_configurations = {
    match_extension_lambda = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.match_extension_lambda_policy.json]
    }
    voice_mail_packager_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.voice_mail_packager_lambda_policy.json]
    }
    kvs_to_s3_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.kvs_to_s3_lambda_policy.json]
    }
    voice_mail_presigner_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.voice_mail_presigner_lambda_policy.json]
    }
    voice_mail_transcriber_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.voice_mail_transcriber_lambda_policy.json]
    }
    get_connect_config_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.get_connect_config_lambda_policy.json]
    }
    check_holiday_and_hoop_lambda_policy = {
      number_of_policy_jsons = 1
      policy_jsons           = [data.aws_iam_policy_document.check_holiday_and_hoop_lambda_policy.json]
    }
  }
}
