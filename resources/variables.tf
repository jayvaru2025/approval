variable "company_prefix" {
  type        = string
  description = "Company prefix."
}

variable "company" {
  type        = string
  description = "Company name."
}

variable "project" {
  type        = string
  description = "Project name."
  default     = "CCaaS"
}

variable "lob" {
  type        = string
  description = "lob name."
  default     = "telesales"
}

variable "region" {
  type        = string
  description = "AWS region."
}

variable "env" {
  type        = string
  description = "Deployment environment."
}

variable "repo_url" {
  type        = string
  description = "Repository URL."
  default     = "https://github.com/Clover-Health-1/ccaas-terraform-connect.git"
}

variable "account_number" {
  description = "Account Number."
  type        = string
  default     = null
}

variable "role_name" {
  description = "Role name."
  type        = string
  default     = "shared-gitlab-oidc-role"
}


variable "is_primary" {
  type    = bool
  default = false
}