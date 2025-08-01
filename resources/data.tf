data "aws_caller_identity" "current" {}
data "aws_iam_policy_document" "match_extension_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [
      module.connect_config_dynamodb.dynamodb_table_arn,
      "${module.connect_config_dynamodb.dynamodb_table_arn}/*"
    ]
  }
  statement {
    sid     = "AllowKMS"
    effect  = "Allow"
    actions = ["kms:Decrypt"]
    resources = [
      "arn:aws:kms:${var.region}:${var.account_number}:key/*"
    ]
  }
}

data "aws_iam_policy_document" "voice_mail_packager_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "connect:DescribeUser",
      "connect:DescribeQueue",
      "connect:GetContactAttributes",
      "connect:UpdateContactAttributes",
      "connect:StartTaskContact"
    ]
    resources = [
      module.amazon_connect.instance_arn,
      "${module.amazon_connect.instance_arn}/*",
    ]
  }
  statement {
    sid    = "AllowS3Access"
    effect = "Allow"
    actions = [
      "s3:ListBucket",
      "s3:GetObjectTagging",
      "s3:GetObject"
    ]
    resources = [
      module.s3_voice_mail_transcript.bucket_arn,
      "${module.s3_voice_mail_transcript.bucket_arn}/*",
      module.s3_voice_mail_recording.bucket_arn,
      "${module.s3_voice_mail_recording.bucket_arn}/*"
    ]
  }
  statement {
    sid     = "AllowLambdaInvoke"
    effect  = "Allow"
    actions = ["lambda:InvokeFunction"]
    resources = [
      "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:${var.company_prefix}-lmda-voice-mail-presigner-${local.region_prefix}-${var.env}"
    ]
  }
}


data "aws_iam_policy_document" "kvs_to_s3_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "kinesis:GetRecords",
      "kinesis:GetShardIterator",
      "kinesis:DescribeStream",
      "kinesis:DescribeStreamSummary",
      "kinesis:ListShards",
      "kinesis:ListStreams",
      "kinesisvideo:GetDataEndpoint",
      "kinesisvideo:ListFragments",
      "kinesisvideo:GetMediaForFragmentList"
    ]
    resources = [
      "${module.kinesis.kinesis_stream_arn}",
      "arn:aws:kinesisvideo:${var.region}:${data.aws_caller_identity.current.account_id}:stream/*"
    ]
  }
  statement {
    sid    = "AllowS3Access"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectTagging"
    ]
    resources = [
      module.s3_voice_mail_recording.bucket_arn,
      "${module.s3_voice_mail_recording.bucket_arn}/*"
    ]
  }
}


data "aws_iam_policy_document" "voice_mail_presigner_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:GetObjectTagging"
    ]
    resources = [
      module.s3_voice_mail_recording.bucket_arn,
      "${module.s3_voice_mail_recording.bucket_arn}/*"
    ]
  }
}


data "aws_iam_policy_document" "voice_mail_transcriber_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:PutObjectTagging",
    ]
    resources = [
      module.s3_voice_mail_transcript.bucket_arn,
      "${module.s3_voice_mail_transcript.bucket_arn}/*"
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:GetObjectTagging"
    ]
    resources = [
      module.s3_voice_mail_recording.bucket_arn,
      "${module.s3_voice_mail_recording.bucket_arn}/*"
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "transcribe:StartTranscriptionJob"
    ]
    resources = [
      "arn:aws:transcribe:${var.region}:${data.aws_caller_identity.current.account_id}:transcription-job/*"
    ]
  }
}

data "aws_iam_policy_document" "get_connect_config_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [
      module.connect_config_dynamodb.dynamodb_table_arn,
      "${module.connect_config_dynamodb.dynamodb_table_arn}/*"
    ]
  }
  statement {
    sid     = "AllowKMS"
    effect  = "Allow"
    actions = ["kms:Decrypt"]
    resources = [
      "arn:aws:kms:${var.region}:${var.account_number}:key/*"
    ]
  }
}

data "aws_iam_policy_document" "check_holiday_and_hoop_lambda_policy" {
  version = "2012-10-17"
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem"
    ]
    resources = [
      module.connect_config_dynamodb.dynamodb_table_arn,
      "${module.connect_config_dynamodb.dynamodb_table_arn}/*"
    ]
  }
  statement {
    sid     = "AllowKMS"
    effect  = "Allow"
    actions = ["kms:Decrypt"]
    resources = [
      "arn:aws:kms:${var.region}:${var.account_number}:key/*"
    ]
  }
}