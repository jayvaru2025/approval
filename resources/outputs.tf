output "get_connect_config_lambda" {
  description = "ARN of the Lambda function for contact flow attributes."
  value       = module.get_connect_config_lambda.lambda_function_arn
}

output "kms_key" {
  description = "ARN of the KMS key used for encryption."
  value       = module.common_aws_kms_key.key_arn
}

output "connect_module" {
  description = "Amazon Connect module outputs."
  value       = module.amazon_connect.contact_flow_modules["ch_voice_mail_module"].contact_flow_module_id
}

output "kinesis_stream_arn" {
  description = "ARN of the Kinesis stream for media streams."
  value       = module.kinesis.kinesis_stream_arn
}

output "telesales_7th_dec_hoo_arn" {
  description = "ARN of the operating hours for telesales on 7th December."
  value       = module.amazon_connect.hours_of_operations["telesales_7th_dec"].arn
}

output "telesales_apr_to_sep_hoo_arn" {
  description = "ARN of the operating hours for telesales from April to September."
  value       = module.amazon_connect.hours_of_operations["telesales_apr_to_sep"].arn
}

output "telesales_oct_to_mar_hoo_arn" {
  description = "ARN of the operating hours for telesales from October to March."
  value       = module.amazon_connect.hours_of_operations["telesales_oct_to_mar"].arn
}

output "ch_telesales_cms_en_queue_arn" {
  description = "ARN of the Telesales CMS English Queue."
  value       = module.amazon_connect.queues["ch_telesales_cms_en"].arn
}

output "ch_telesales_cms_es_queue_arn" {
  description = "ARN of the Telesales CMS Spanish Queue."
  value       = module.amazon_connect.queues["ch_telesales_cms_es"].arn
}

output "ch_telesales_en_queue_arn" {
  description = "ARN of the Telesales English Queue."
  value       = module.amazon_connect.queues["ch_telesales_en"].arn
}

output "ch_telesales_es_queue_arn" {
  description = "ARN of the Telesales Spanish Queue."
  value       = module.amazon_connect.queues["ch_telesales_es"].arn
}

output "ch_telesales_outbound_queue_arn" {
  description = "ARN of the Outbound Queue for Telesales."
  value       = module.amazon_connect.queues["ch_telesales_outbound"].arn
}

output "collect_extention_number_id" {
  description = "List of phone number IDs to associate."
  value       = module.amazon_connect.phone_number_id["collect_extention_number"]
}