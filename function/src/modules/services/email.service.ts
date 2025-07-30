import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { getConfig } from '../../utils/config';
import { customLogger } from '../../utils/logger';
import moment from 'moment';

const logger = customLogger('SES::SES.service');

export const generateEmailTemplateForUserLogin = (
  LogoUrl: string,
  Email: string,
  UserName: string,
  Password: string,
  ResetLink: string,
  BusinessName: string,
  userType: string,
) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Precision Electric</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f8fa;
      color: #333;
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .email-container {
      width: 100%;
      background-color: #ededed;
      padding: 20px 0;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .header {
      background: #0072BC;
      padding: 24px 30px;
      text-align: center;
    }

    .header .logo {
      display: inline-block;
      vertical-align: middle;
      margin-right: 15px;
    }

    .header .logo svg {
      max-width: 100%;
      height: auto;
    }

    .main-content {
      padding: 30px 30px;
      text-align: center;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
      color: #2c3e50;
    }

    .subtitle {
      color: #555555;
      font-size: 16px;
      margin: 0 0 30px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }

    .greeting {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 20px 0;
      text-align: left;
      font-family: 'Inter', Arial, sans-serif;
      color: #2c3e50;
    }

    .credentials-box {
      background-color: #D7EEFB;
      border-radius: 12px;
      margin: 30px 0;
      padding: 30px;
      text-align: left;
    }

    .credentials-title {
      color: #002C45;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 25px 0;
      font-family: 'Inter', Arial, sans-serif;
      text-align: center;
    }

    .credential-item {
      margin-bottom: 20px;
    }

    .credential-label {
      color: #002C45;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      display: block;
      font-family: 'Inter', Arial, sans-serif;
    }

    .credential-value {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 12px 15px;
      font-size: 16px;
      font-family: 'Inter', Arial, sans-serif;
      color: #2c3e50;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .password-value {
      font-family: 'Courier New', monospace;
      color: #e63946;
      font-weight: 600;
      font-size: 18px;
      letter-spacing: 1px;
    }

    .warning-box {
      background: #f8d7da;
      border-radius: 12px;
      padding: 20px;
      margin: 30px 0;
      text-align: center;
      border: 1px solid #f5c2c7;
    }

    .warning-text {
      color: #842029;
      font-size: 16px;
      font-weight: 400;
      margin: 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .button-container {
      text-align: center;
      margin: 30px 0;
    }

    .login-button {
      display: inline-flex;
      align-items: center;
      background-color: #1e73be;
      color: #ffffff;
      padding: 15px 40px;
      border-radius: 25px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      font-family: 'Inter', Arial, sans-serif;
      white-space: nowrap;
      transition: background-color 0.3s ease;
    }

    .login-button:hover {
      background-color: #155a8a;
    }

    .note {
      color: #555555;
      font-size: 14px;
      margin: 25px 0;
      font-family: 'Inter', Arial, sans-serif;
      text-align: center;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ebec;
    }

    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }

    .footer-title {
      color: #2c3e50;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 10px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .footer-text {
      color: #888888;
      font-size: 14px;
      margin: 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    /* Mobile Responsive Styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        padding: 10px 0;
      }

      .email-wrapper {
        margin: 0 10px;
        border-radius: 0;
      }

      .header {
        padding: 20px 15px;
      }

      .header .logo {
        margin-right: 10px;
      }

      .header .logo svg {
        width: 150px;
        height: auto;
      }

      .main-content {
        padding: 20px 15px;
      }

      .title {
        font-size: 20px;
        margin-bottom: 15px;
      }

      .subtitle {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .greeting {
        font-size: 16px;
        margin-bottom: 15px;
      }

      .credentials-box {
        padding: 20px 15px;
        margin: 20px 0;
      }

      .credentials-title {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .credential-value {
        padding: 10px 12px;
        font-size: 14px;
      }

      .password-value {
        font-size: 16px;
      }

      .warning-box {
        padding: 15px;
        margin: 20px 0;
      }

      .warning-text {
        font-size: 14px;
      }

      .login-button {
        padding: 12px 30px;
        font-size: 14px;
      }

      .note {
        font-size: 12px;
        padding: 12px;
        margin: 20px 0;
      }

      .footer {
        padding: 20px 15px;
      }

      .footer-title {
        font-size: 16px;
      }

      .footer-text {
        font-size: 12px;
      }

      .divider {
        margin: 20px 0;
      }
    }

    /* Very Small Mobile Devices */
    @media only screen and (max-width: 480px) {
      .email-wrapper {
        margin: 0 5px;
      }

      .main-content {
        padding: 15px 10px;
      }

      .credentials-box,
      .warning-box {
        padding: 15px 10px;
      }

      .header .logo svg {
        width: 120px;
      }

      .login-button {
        padding: 10px 20px;
        font-size: 12px;
      }

      .password-value {
        font-size: 14px;
        word-break: break-all;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-wrapper">

      <!-- Header -->
      <div class="header">
        <div class="logo">
        ${LogoUrl ? `<img width="191" height="79"  src="${LogoUrl}" alt="${BusinessName}" class="logo" />` : ''}
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">

        <!-- Title -->
        <h1 class="title">Welcome to ${BusinessName}</h1>

        <!-- Subtitle -->
        <p class="subtitle">Your account has been created successfully. Please use the credentials below to access your
          account.</p>

        <!-- Credentials Box -->
        <div class="credentials-box">
          <h2 class="credentials-title">Your Account Details</h2>

          <div class="credential-item">
            <span class="credential-label">Email Address</span>
            <div class="credential-value">${Email}</div>
          </div>

          <div class="credential-item">
            <span class="credential-label">Temporary Password</span>
            <div class="credential-value password-value">${Password}</div>
          </div>
        </div>

        <!-- Warning Box -->
        <div class="warning-box">
          <p class="warning-text">Please reset this password after your first login to keep your account secure.</p>
        </div>

        <!-- Login Button -->
        <div class="button-container">
          <a href=${ResetLink} class="login-button">
            Login
          </a>
        </div>

        <!-- Note -->
        <div class="note">
          <strong>Security Note:</strong> If you did not request this account, please contact our support team
          immediately. This email contains sensitive information and should be kept confidential.
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <h3 class="footer-title">${BusinessName}</h3>
        <p class="footer-text">© 2025 ${BusinessName}. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>
`;

  return htmlContent;
};

export const sendEmailWithContent = async (
  UserName: string,
  Password: string,
  ResetLink: string,
  BusinessName: string,
  sourceEmail: string,
  recipientEmail: string,
  LogoUrl: string,
  userType: string,
) => {
  const {
    AWS: { REGION: region },
  } = getConfig();
  logger.info('Email called');

  const sesClient = new SESClient({ region });

  const htmlContent = generateEmailTemplateForUserLogin(
    LogoUrl,
    recipientEmail,
    UserName,
    Password,
    ResetLink,
    BusinessName,
    userType,
  );
  const recipientEmails = [recipientEmail];

  const sendEmailCommand = new SendEmailCommand({
    Destination: {
      ToAddresses: [...recipientEmails],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlContent,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Temporary Credential',
      },
    },
    Source: sourceEmail,
    ReplyToAddresses: [],
  });

  try {
    await sesClient.send(sendEmailCommand);

    logger.info('Email sended successfully');

    return;
  } catch (error) {
    logger.error(`Error sending Mail ${error}`);
    throw new Error('Customer added but error get at sending Mail');
  }
};
export const generateEmailTemplateForAppointment = (
  LogoUrl: string,
  BusinessName: string,
  TenantPhoneNumber: string,
  companyPrefix: string,
  appointmentDetails: {
    id: string;
    customerName: string;
    email: string;
    phoneNumber: string;
    address: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    serviceType?: string;
    notes?: string;
    status: 'Scheduled' | 'Rejected' | 'Completed' | string;
    appointmentReschedule?: boolean;
    rejectReason?: string;
  },
  technicianDetails?: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  },
) => {
  const isRescheduled = appointmentDetails.appointmentReschedule === true;
  const formattedDate = appointmentDetails.appointmentDate
    ? moment(appointmentDetails.appointmentDate).format('MMMM D, YYYY')
    : 'N/A';

  // Determine status information
  let statusTitle = 'Appointment';
  let statusColor = '#0072BC';
  let statusBgColor = '#E6F1F8';
  let statusMessage = '';
  let statusIcon = '✓';

  switch (appointmentDetails.status) {
    case 'Scheduled':
      statusTitle = isRescheduled ? 'Rescheduled Appointment' : 'Confirmed Appointment';
      statusColor = isRescheduled ? '#FF9800' : '#34A853';
      statusBgColor = isRescheduled ? '#FFF4E5' : '#E6F4EA';
      statusMessage = isRescheduled
        ? 'This appointment has been rescheduled. Please review the updated details below.'
        : 'Your appointment has been confirmed. We look forward to seeing you!';
      statusIcon = isRescheduled ? '⚠️' : '✓';
      break;
    case 'Rejected':
      statusTitle = 'Appointment Rejected';
      statusColor = '#EA4335';
      statusBgColor = '#FDEDED';
      statusMessage = 'We regret to inform you that your appointment request has been rejected.';
      statusIcon = '✕';
      break;
    case 'Completed':
      statusTitle = 'Appointment Completed';
      statusColor = '#34A853';
      statusBgColor = '#E6F4EA';
      statusMessage = 'Your appointment has been successfully completed. Thank you for your business!';
      statusIcon = '✓';
      break;
    default:
      // Default case handles any other status
      statusTitle = `Appointment ${appointmentDetails.status}`;
      break;
  }

  const htmlTemplate = `
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmed - BrightFix Plumbing</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f8fa;
      color: #333;
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    .email-container {
      width: 100%;
      background-color: #ededed;
      padding: 20px 0;
    }

    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
    }

    .header {
      background: #0072BC;
      padding: 24px 30px;
      text-align: center;
    }

    .header .logo {
      display: inline-block;
      vertical-align: middle;
      margin-right: 15px;
    }

    .header .logo svg {
      max-width: 100%;
      height: auto;
    }

    .main-content {
      padding: 30px 30px;
      text-align: center;
    }

    .checkmark-circle {
      width: 100px;
      height: 100px;
      background-color: #D1E7DD;
      border-radius: 50%;
      margin: 0 auto 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #BADBCC;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .subtitle {
      color: #555555;
      font-size: 16px;
      margin: 0 0 30px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .divider {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }

    .greeting {
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 14px 0;
      text-align: left;
      font-family: 'Inter', Arial, sans-serif;
    }

    .message {
      color: #555555;
      font-size: 16px;
      margin: 0 0 30px 0;
      text-align: left;
      line-height: 1.5;
      font-family: 'Inter', Arial, sans-serif;
    }

    .appointment-box {
      background: linear-gradient(135deg, #7dd3fc 0%, #a78bfa 100%);
      background-color: #7dd3fc;
      border-radius: 12px;
      margin: 30px 0;
      padding: 30px;
      text-align: center;
    }

    .appointment-title {
      color: #002C45;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 25px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .appointment-details {
      width: 100%;
      display: flex;
      gap: 2%;
      flex-wrap: wrap;
    }

    .detail-item {
      flex: 1;
      min-width: 200px;
    }

    .detail-box {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 15px;
      margin: 0;
      width: 100%;
      box-sizing: border-box;
    }

    .detail-icon {
      vertical-align: middle;
      margin-right: 8px;
    }

    .detail-text {
      font-size: 16px;
      font-weight: 400;
      vertical-align: middle;
      font-family: 'Inter', Arial, sans-serif;
    }

    .technician-box {
      background: linear-gradient(90deg, #C6D5FE 0%, #D0BAFF 100%);
      border-radius: 12px;
      margin: 30px 0;
      padding: 30px;
      text-align: left;
    }

    .technician-title {
      color: #002C45;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .technician-info {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .technician-avatar {
      width: 60px;
      height: 60px;
      background-color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
      color: #0072BC;
      font-family: 'Inter', Arial, sans-serif;
      flex-shrink: 0;
    }

    .technician-details {
      flex: 1;
      min-width: 200px;
    }

    .technician-name {
      color: #002C45;
      font-size: 24px;
      font-weight: 500;
      margin: 0 0 8px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .technician-contact {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-wrap: wrap;
    }

    .contact-item {
      display: flex;
      align-items: center;
      color: #000;
      font-size: 14px;
      font-family: 'Inter', Arial, sans-serif;
      min-width: 150px;
      gap: 6px;
    }

    .contact-icon {
      margin-right: 6px;
      flex-shrink: 0;
    }

    .reminders-section {
      margin: 30px 0;
      text-align: left;
    }

    .reminders-title {
      color: #000;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .reminders-list {
      color: #000;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding-left: 20px;
      font-family: 'Inter', Arial, sans-serif;
    }

    .reminder-item {
      margin-bottom: 12px;
    }

    .thanks-title {
      font-size: 24px;
      font-weight: bold;
      margin: 30px 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .contact-info {
      color: #555555;
      font-size: 16px;
      margin: 0 0 20px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .phone-button {
      display: inline-flex;
      align-items: center;
      background-color: #1e73be;
      color: #ffffff;
      padding: 12px 30px;
      border-radius: 25px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      font-family: 'Inter', Arial, sans-serif;
      white-space: nowrap;
    }

    .phone-icon {
      margin-right: 8px;
      flex-shrink: 0;
    }

    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
    }

    .footer-title {
      color: #2c3e50;
      font-size: 18px;
      font-weight: bold;
      margin: 0 0 10px 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    .footer-text {
      color: #888888;
      font-size: 14px;
      margin: 0;
      font-family: 'Inter', Arial, sans-serif;
    }

    /* Mobile Responsive Styles */
    @media only screen and (max-width: 600px) {
      .email-container {
        padding: 10px 0;
      }

      .email-wrapper {
        margin: 0 10px;
        border-radius: 0;
      }

      .header {
        padding: 20px 15px;
      }

      .header .logo {
        margin-right: 10px;
      }

      .header .logo svg {
        width: 150px;
        height: auto;
      }

      .main-content {
        padding: 20px 15px;
      }

      .checkmark-circle {
        width: 80px;
        height: 80px;
        margin-bottom: 15px;
      }

      .checkmark-circle svg {
        width: 40px;
        height: 40px;
      }

      .title {
        font-size: 20px;
        margin-bottom: 15px;
      }

      .subtitle {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .greeting {
        font-size: 16px;
        margin-bottom: 10px;
      }

      .message {
        font-size: 14px;
        margin-bottom: 20px;
      }

      .appointment-box {
        padding: 20px 15px;
        margin: 20px 0;
      }

      .appointment-title {
        font-size: 18px;
        margin-bottom: 20px;
      }

      .appointment-details {
        flex-direction: column;
        gap: 10px;
      }

      .detail-item {
        width: 100%;
        margin: 0;
      }

      .detail-box {
        padding: 12px;
        text-align: center;
      }

      .detail-text {
        font-size: 14px;
      }

      .technician-box {
        padding: 20px 15px;
        margin: 20px 0;
      }

      .technician-title {
        font-size: 16px;
        margin-bottom: 15px;
        text-align: center;
      }

      .technician-info {
        flex-direction: column;
        align-items: center;
        gap: 10px;
        text-align: center;
      }

      .technician-avatar {
        width: 50px;
        height: 50px;
        font-size: 20px;
      }

      .technician-details {
        min-width: auto;
        width: 100%;
      }

      .technician-name {
        font-size: 18px;
        margin-bottom: 10px;
      }

      .technician-contact {
        flex-direction: column;
        gap: 8px;
        align-items: center;
        text-align: center;
      }

      .contact-item {
        font-size: 12px;
        min-width: auto;
        word-break: break-all;
      }

      .reminders-section {
        margin: 20px 0;
      }

      .reminders-title {
        font-size: 16px;
        margin-bottom: 15px;
      }

      .reminders-list {
        font-size: 14px;
        padding-left: 15px;
      }

      .reminder-item {
        margin-bottom: 8px;
      }

      .thanks-title {
        font-size: 20px;
        margin: 20px 0 15px 0;
      }

      .contact-info {
        font-size: 14px;
        margin-bottom: 15px;
      }

      .phone-button {
        padding: 10px 20px;
        font-size: 14px;
      }

      .phone-icon svg {
        width: 20px;
        height: 20px;
      }

      .footer {
        padding: 20px 15px;
      }

      .footer-title {
        font-size: 16px;
      }

      .footer-text {
        font-size: 12px;
      }

      .divider {
        margin: 20px 0;
      }
    }

    /* Very Small Mobile Devices */
    @media only screen and (max-width: 480px) {
      .email-wrapper {
        margin: 0 5px;
      }

      .main-content {
        padding: 15px 10px;
      }

      .appointment-box,
      .technician-box {
        padding: 15px 10px;
      }

      .header .logo svg {
        width: 120px;
      }

      .phone-button {
        padding: 8px 15px;
        font-size: 12px;
      }

      .contact-item {
        font-size: 11px;
      }

      .technician-name {
        font-size: 16px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-wrapper">

      <!-- Header -->
      <div class="header">
        <div class="logo">
          <svg width="191" height="79" viewBox="0 0 191 79" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M51.638 6.1875L46.5719 13.6511H47.7545C50.966 13.6511 53.9852 14.8913 56.2561 17.1434C58.5271 19.3955 59.7777 22.3898 59.7777 25.5747C59.7777 28.7596 58.5271 31.754 56.2561 34.006C53.9853 36.258 50.966 37.4983 47.7545 37.4983H40.3873L34.9297 45.3373H47.7545C58.7602 45.3373 67.6821 36.4893 67.6821 25.5747C67.6821 15.9781 60.7846 7.97936 51.638 6.1875Z"
              fill="#FFA000" />
            <path
              d="M35.8731 24.2635L48.3976 5.8125H26.6953L15.4021 37.6102L23.8069 36.8105L14.0766 56.5383L20.0526 57.1232L13.9219 73.1316L34.3127 50.1018L29.0133 48.7748L45.8783 24.5503L35.8731 24.2635Z"
              fill="#033953" />
            <path
              d="M88.263 30.4851C88.263 31.2634 88.0778 31.9976 87.7077 32.6878C87.3375 33.378 86.7453 33.9433 85.9309 34.3839C85.1165 34.8097 84.0727 35.0226 82.7992 35.0226H80.0008V41.2343H77.4688V25.9255H82.7992C83.9838 25.9255 84.9833 26.1311 85.7977 26.5422C86.6271 26.9387 87.2414 27.482 87.6414 28.1722C88.0558 28.8624 88.263 29.6334 88.263 30.4851ZM82.7992 32.9741C83.7616 32.9741 84.4799 32.7612 84.954 32.3353C85.4275 31.8948 85.6646 31.278 85.6646 30.4851C85.6646 28.811 84.7092 27.974 82.7992 27.974H80.0008V32.9741H82.7992ZM93.2104 30.8595C93.5806 30.2428 94.0691 29.7655 94.6763 29.4278C95.2978 29.0753 96.031 28.8991 96.8753 28.8991V31.4983H96.2309C95.2386 31.4983 94.4833 31.748 93.965 32.2472C93.4618 32.7465 93.2104 33.6129 93.2104 34.8464V41.2343H90.6783V29.0974H93.2104V30.8595ZM110.419 34.8685C110.419 35.3237 110.39 35.7349 110.331 36.102H100.98C101.054 37.0712 101.417 37.8495 102.068 38.4368C102.719 39.0242 103.519 39.3179 104.467 39.3179C105.829 39.3179 106.791 38.7526 107.354 37.6218H110.086C109.716 38.7379 109.042 39.6557 108.065 40.3752C107.102 41.0801 105.903 41.4325 104.467 41.4325C103.297 41.4325 102.246 41.1755 101.313 40.6616C100.395 40.1329 99.6691 39.3987 99.1359 38.4589C98.6176 37.5044 98.3586 36.403 98.3586 35.1548C98.3586 33.9066 98.61 32.8126 99.1139 31.8728C99.6322 30.9183 100.35 30.184 101.269 29.6701C102.201 29.1561 103.268 28.8991 104.467 28.8991C105.622 28.8991 106.651 29.1488 107.554 29.648C108.457 30.1473 109.161 30.8522 109.665 31.7626C110.168 32.6584 110.419 33.6937 110.419 34.8685ZM107.777 34.0755C107.762 33.1503 107.428 32.4088 106.777 31.8507C106.125 31.2927 105.318 31.0137 104.356 31.0137C103.482 31.0137 102.734 31.2927 102.113 31.8507C101.491 32.3941 101.12 33.1357 101.002 34.0755H107.777ZM112.067 35.1548C112.067 33.9066 112.319 32.8126 112.822 31.8728C113.34 30.9183 114.052 30.184 114.955 29.6701C115.858 29.1561 116.894 28.8991 118.064 28.8991C119.545 28.8991 120.767 29.2516 121.729 29.9564C122.706 30.6466 123.365 31.6378 123.705 32.9301H120.974C120.752 32.328 120.397 31.8581 119.908 31.5203C119.419 31.1826 118.805 31.0137 118.064 31.0137C117.028 31.0137 116.199 31.3808 115.576 32.1151C114.969 32.8346 114.666 33.8479 114.666 35.1548C114.666 36.4617 114.969 37.4823 115.576 38.2166C116.199 38.9508 117.028 39.3179 118.064 39.3179C119.53 39.3179 120.5 38.6791 120.974 37.4016H123.705C123.35 38.6351 122.684 39.619 121.706 40.3532C120.73 41.0727 119.515 41.4325 118.064 41.4325C116.894 41.4325 115.858 41.1755 114.955 40.6616C114.052 40.1329 113.34 39.3987 112.822 38.4589C112.319 37.5044 112.067 36.403 112.067 35.1548ZM127.517 27.4894C127.059 27.4894 126.673 27.3352 126.362 27.0268C126.051 26.7184 125.896 26.3366 125.896 25.8814C125.896 25.4262 126.051 25.0444 126.362 24.736C126.673 24.4276 127.059 24.2734 127.517 24.2734C127.961 24.2734 128.339 24.4276 128.65 24.736C128.961 25.0444 129.117 25.4262 129.117 25.8814C129.117 26.3366 128.961 26.7184 128.65 27.0268C128.339 27.3352 127.961 27.4894 127.517 27.4894ZM128.761 29.0974V41.2343H126.229V29.0974H128.761ZM136.527 41.4325C135.565 41.4325 134.699 41.2636 133.929 40.9259C133.174 40.5735 132.574 40.1036 132.13 39.5162C131.686 38.9141 131.449 38.2459 131.419 37.5117H134.04C134.084 38.0257 134.329 38.4589 134.773 38.8113C135.232 39.149 135.802 39.3179 136.483 39.3179C137.194 39.3179 137.742 39.1858 138.127 38.9214C138.526 38.6424 138.726 38.29 138.726 37.8641C138.726 37.4089 138.504 37.0712 138.06 36.8509C137.631 36.6306 136.942 36.3883 135.995 36.124C135.077 35.8744 134.329 35.6321 133.751 35.3971C133.174 35.1621 132.67 34.8024 132.241 34.3178C131.826 33.8332 131.619 33.1944 131.619 32.4014C131.619 31.7553 131.812 31.1679 132.196 30.6393C132.581 30.0959 133.13 29.6701 133.84 29.3617C134.565 29.0533 135.395 28.8991 136.328 28.8991C137.72 28.8991 138.838 29.2516 139.682 29.9564C140.54 30.6466 140.999 31.5938 141.059 32.7979H138.526C138.482 32.2546 138.26 31.8214 137.86 31.4983C137.461 31.1753 136.92 31.0137 136.239 31.0137C135.573 31.0137 135.062 31.1385 134.706 31.3882C134.351 31.6378 134.173 31.9682 134.173 32.3794C134.173 32.7025 134.292 32.9741 134.528 33.1944C134.765 33.4147 135.054 33.5909 135.395 33.723C135.736 33.8405 136.239 33.9947 136.905 34.1856C137.794 34.4206 138.519 34.6629 139.082 34.9125C139.66 35.1475 140.155 35.4999 140.57 35.9698C140.985 36.4397 141.2 37.0638 141.214 37.8421C141.214 38.5323 141.022 39.149 140.636 39.6924C140.252 40.2357 139.704 40.6616 138.993 40.97C138.297 41.2783 137.476 41.4325 136.527 41.4325ZM145.238 27.4894C144.779 27.4894 144.394 27.3352 144.084 27.0268C143.773 26.7184 143.617 26.3366 143.617 25.8814C143.617 25.4262 143.773 25.0444 144.084 24.736C144.394 24.4276 144.779 24.2734 145.238 24.2734C145.683 24.2734 146.06 24.4276 146.371 24.736C146.682 25.0444 146.837 25.4262 146.837 25.8814C146.837 26.3366 146.682 26.7184 146.371 27.0268C146.06 27.3352 145.683 27.4894 145.238 27.4894ZM146.482 29.0974V41.2343H143.95V29.0974H146.482ZM155.115 41.4325C153.96 41.4325 152.916 41.1755 151.984 40.6616C151.05 40.1329 150.318 39.3987 149.785 38.4589C149.251 37.5044 148.985 36.403 148.985 35.1548C148.985 33.9213 149.258 32.8273 149.807 31.8728C150.355 30.9183 151.102 30.184 152.05 29.6701C152.997 29.1561 154.057 28.8991 155.226 28.8991C156.396 28.8991 157.454 29.1561 158.402 29.6701C159.35 30.184 160.098 30.9183 160.646 31.8728C161.193 32.8273 161.467 33.9213 161.467 35.1548C161.467 36.3883 161.186 37.4823 160.623 38.4368C160.061 39.3913 159.29 40.1329 158.314 40.6616C157.351 41.1755 156.285 41.4325 155.115 41.4325ZM155.115 39.2518C155.767 39.2518 156.374 39.0977 156.936 38.7893C157.514 38.4809 157.98 38.0183 158.336 37.4016C158.691 36.7848 158.869 36.0359 158.869 35.1548C158.869 34.2737 158.698 33.5321 158.358 32.9301C158.018 32.3133 157.565 31.8507 157.003 31.5424C156.44 31.234 155.833 31.0798 155.181 31.0798C154.53 31.0798 153.923 31.234 153.36 31.5424C152.812 31.8507 152.376 32.3133 152.05 32.9301C151.724 33.5321 151.561 34.2737 151.561 35.1548C151.561 36.4617 151.895 37.475 152.561 38.1945C153.242 38.8994 154.094 39.2518 155.115 39.2518ZM170.145 28.8991C171.108 28.8991 171.966 29.0974 172.722 29.4939C173.492 29.8903 174.091 30.4777 174.52 31.256C174.95 32.0343 175.165 32.9741 175.165 34.0755V41.2343H172.655V34.4499C172.655 33.3633 172.381 32.5336 171.833 31.9609C171.285 31.3735 170.537 31.0798 169.59 31.0798C168.642 31.0798 167.887 31.3735 167.324 31.9609C166.777 32.5336 166.502 33.3633 166.502 34.4499V41.2343H163.97V29.0974H166.502V30.4851C166.917 29.9858 167.443 29.5966 168.079 29.3176C168.731 29.0386 169.42 28.8991 170.145 28.8991Z"
              fill="white" />
            <path
              d="M77.9003 49.2456V52.1269H81.0678V53.0543H77.9003V56.0222H81.4418V56.9496H76.7656V48.3181H81.4418V49.2456H77.9003ZM88.0343 47.7987V56.9496H86.8991V47.7987H88.0343ZM99.9432 53.3017C99.9432 53.516 99.9308 53.7427 99.9062 53.9818H94.4444C94.4859 54.6496 94.7145 55.1731 95.1302 55.5523C95.5542 55.9233 96.0654 56.1087 96.6641 56.1087C97.1545 56.1087 97.5617 55.9975 97.8857 55.7749C98.2183 55.544 98.4514 55.239 98.5846 54.8598H99.8061C99.6237 55.5111 99.2574 56.0428 98.7092 56.455C98.1605 56.859 97.4785 57.0609 96.6641 57.0609C96.0153 57.0609 95.4334 56.9167 94.9184 56.6281C94.4112 56.3396 94.0125 55.9315 93.7215 55.4039C93.4306 54.868 93.2851 54.2497 93.2851 53.549C93.2851 52.8482 93.426 52.234 93.7085 51.7064C93.9917 51.1788 94.3865 50.7749 94.8931 50.4946C95.4088 50.206 95.9991 50.0617 96.6641 50.0617C97.3123 50.0617 97.8857 50.2019 98.3845 50.4822C98.8833 50.7625 99.2658 51.15 99.5321 51.6446C99.8062 52.131 99.9432 52.6833 99.9432 53.3017ZM98.7716 53.0667C98.7716 52.638 98.6755 52.2711 98.4845 51.9661C98.2936 51.6528 98.0312 51.4179 97.6987 51.2613C97.3746 51.0964 97.0129 51.0139 96.6141 51.0139C96.0407 51.0139 95.5504 51.1953 95.1425 51.558C94.7437 51.9208 94.5151 52.4237 94.4567 53.0667H98.7716ZM104.758 53.549C104.758 52.8482 104.899 52.2382 105.182 51.7188C105.465 51.1912 105.855 50.7831 106.354 50.4946C106.861 50.206 107.439 50.0617 108.087 50.0617C108.927 50.0617 109.617 50.2637 110.157 50.6677C110.706 51.0716 111.067 51.6322 111.242 52.3495H110.02C109.904 51.9373 109.675 51.6116 109.334 51.3725C109.002 51.1335 108.586 51.0139 108.087 51.0139C107.439 51.0139 106.915 51.2365 106.516 51.6817C106.117 52.1186 105.917 52.7411 105.917 53.549C105.917 54.3651 106.117 54.9958 106.516 55.441C106.915 55.8862 107.439 56.1087 108.087 56.1087C108.586 56.1087 109.002 55.9933 109.334 55.7625C109.667 55.5317 109.895 55.2019 110.02 54.7732H111.242C111.059 55.4657 110.693 56.0222 110.145 56.4426C109.596 56.8548 108.91 57.0609 108.087 57.0609C107.439 57.0609 106.861 56.9167 106.354 56.6281C105.855 56.3396 105.465 55.9315 105.182 55.4039C104.899 54.8763 104.758 54.258 104.758 53.549ZM117.881 51.1005V55.0947C117.881 55.4245 117.952 55.6594 118.093 55.7996C118.234 55.9315 118.48 55.9975 118.828 55.9975H119.664V56.9496H118.641C118.01 56.9496 117.536 56.8054 117.22 56.5168C116.904 56.2283 116.746 55.7543 116.746 55.0947V51.1005H115.861V50.173H116.746V48.4665H117.881V50.173H119.664V51.1005H117.881ZM125.914 51.2736C126.114 50.8861 126.396 50.5852 126.763 50.3709C127.137 50.1565 127.589 50.0494 128.121 50.0494V51.2118H127.822C126.55 51.2118 125.914 51.896 125.914 53.2646V56.9496H124.78V50.173H125.914V51.2736ZM133.758 49.0725C133.542 49.0725 133.359 48.9983 133.21 48.8499C133.06 48.7015 132.985 48.5201 132.985 48.3058C132.985 48.0914 133.06 47.91 133.21 47.7617C133.359 47.6133 133.542 47.5391 133.758 47.5391C133.966 47.5391 134.141 47.6133 134.282 47.7617C134.432 47.91 134.507 48.0914 134.507 48.3058C134.507 48.5201 134.432 48.7015 134.282 48.8499C134.141 48.9983 133.966 49.0725 133.758 49.0725ZM134.307 50.173V56.9496H133.172V50.173H134.307ZM139.558 53.549C139.558 52.8482 139.699 52.2382 139.981 51.7188C140.264 51.1912 140.655 50.7831 141.154 50.4946C141.661 50.206 142.239 50.0617 142.887 50.0617C143.727 50.0617 144.416 50.2637 144.957 50.6677C145.505 51.0716 145.867 51.6322 146.042 52.3495H144.82C144.703 51.9373 144.475 51.6116 144.134 51.3725C143.801 51.1335 143.386 51.0139 142.887 51.0139C142.239 51.0139 141.715 51.2365 141.316 51.6817C140.917 52.1186 140.717 52.7411 140.717 53.549C140.717 54.3651 140.917 54.9958 141.316 55.441C141.715 55.8862 142.239 56.1087 142.887 56.1087C143.386 56.1087 143.801 55.9933 144.134 55.7625C144.466 55.5317 144.695 55.2019 144.82 54.7732H146.042C145.859 55.4657 145.493 56.0222 144.944 56.4426C144.396 56.8548 143.71 57.0609 142.887 57.0609C142.239 57.0609 141.661 56.9167 141.154 56.6281C140.655 56.3396 140.264 55.9315 139.981 55.4039C139.699 54.8763 139.558 54.258 139.558 53.549Z"
              fill="white" />
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Checkmark Circle -->
        ${
          appointmentDetails.status == 'Rejected'
            ? `<div class="checkmark-circle">
                    <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M14.4022 41.9731L12.0312 39.6022L24.6313 27.0022L12.0312 14.4022L14.4022 12.0312L27.0022 24.6313L39.6022 12.0312L41.9731 14.4022L29.3731 27.0022L41.9731 39.6022L39.6022 41.9731L27.0022 29.3731L14.4022 41.9731Z"
                            fill="#842029" />
                    </svg>
                </div>`
            : `<div class="checkmark-circle">
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.487 39.7225L9.48438 27.7199L11.8896 25.3141L21.487 34.9114L42.1094 14.2891L44.5146 16.6949L21.487 39.7225Z"
              fill="#0F5132" />
          </svg>
        </div>`
        }
       

        <!-- Title -->
        <h1 class="title">${appointmentDetails.status}</h1>

        <!-- Subtitle -->
        <p class="subtitle">Your appointment has been confirmed. We look forward to seeing you!</p>

        <!-- Divider -->
        <hr class="divider">

        <!-- Greeting -->
        <p class="greeting">${appointmentDetails.customerName || 'Customer Name'},</p>

        <!-- Message -->
        <p class="message">Thank you for booking an appointment with us. We've reserved the following date and time for
          you.</p>

        <!-- Appointment Details Box -->
        <div class="appointment-box">
          <h2 class="appointment-title">${appointmentDetails.serviceType || 'Service'}</h2>

          <div class="appointment-details">
            <div class="detail-item">
              <div class="detail-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="detail-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#1e293b" stroke-width="2"
                    fill="none" />
                  <line x1="16" y1="2" x2="16" y2="6" stroke="#1e293b" stroke-width="2" />
                  <line x1="8" y1="2" x2="8" y2="6" stroke="#1e293b" stroke-width="2" />
                  <line x1="3" y1="10" x2="21" y2="10" stroke="#1e293b" stroke-width="2" />
                </svg>
                <span class="detail-text">${formattedDate}</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="detail-icon">
                  <circle cx="12" cy="12" r="10" stroke="#1e293b" stroke-width="2" fill="none" />
                  <polyline points="12,6 12,12 16,14" stroke="#1e293b" stroke-width="2" />
                </svg>
                <span class="detail-text">${appointmentDetails.startTime || 'N/A'} - ${appointmentDetails.endTime || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Technician Section -->
        <div class="technician-box">
          <h3 class="technician-title">Technician</h3>

          <div class="technician-info">
            <div class="technician-avatar">${technicianDetails.firstName[0].toUpperCase()}${technicianDetails.lastName[0].toUpperCase()}</div>
            <div class="technician-details">
              <h4 class="technician-name">${technicianDetails.firstName} ${technicianDetails.lastName}</h4>
              <div class="technician-contact">
                <div class="contact-item">
                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.9027 14.0585C11.555 14.0585 10.2234 13.7647 8.908 13.1771C7.59261 12.5895 6.39582 11.7566 5.31763 10.6784C4.23944 9.6002 3.40653 8.40341 2.81892 7.08802C2.23131 5.77263 1.9375 4.44106 1.9375 3.09332C1.9375 2.89925 2.00219 2.73752 2.13157 2.60814C2.26096 2.47875 2.42269 2.41406 2.61676 2.41406H5.23676C5.38771 2.41406 5.52248 2.46528 5.64108 2.5677C5.75969 2.67013 5.82977 2.79143 5.85133 2.93159L6.27183 5.19579C6.29339 5.3683 6.288 5.51386 6.25565 5.63246C6.22331 5.75106 6.16401 5.85349 6.07775 5.93975L4.50898 7.52469C4.72462 7.92362 4.98069 8.30907 5.2772 8.68105C5.5737 9.05302 5.89985 9.41152 6.25565 9.75654C6.58989 10.0908 6.9403 10.4008 7.30689 10.6865C7.67347 10.9722 8.06162 11.2337 8.47134 11.4709L9.99158 9.95062C10.0886 9.85358 10.2153 9.7808 10.3716 9.73228C10.528 9.68376 10.6816 9.67029 10.8326 9.69185L13.0644 10.1447C13.2154 10.1878 13.3394 10.266 13.4364 10.3792C13.5334 10.4924 13.582 10.6191 13.582 10.7593V13.3793C13.582 13.5733 13.5173 13.7351 13.3879 13.8644C13.2585 13.9938 13.0968 14.0585 12.9027 14.0585ZM3.89442 6.29555L4.96182 5.22814L4.68689 3.70789H3.2475C3.30141 4.14995 3.37688 4.58662 3.47392 5.01789C3.57096 5.44917 3.71112 5.87505 3.89442 6.29555ZM9.6843 12.0854C10.1048 12.2687 10.5334 12.4143 10.97 12.5221C11.4067 12.6299 11.8461 12.7 12.2881 12.7323V11.3091L10.7679 11.0019L9.6843 12.0854Z"
                      fill="black" />
                  </svg>
                  +916282805787
                </div>
                <div class="contact-item">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2.66927 13.5729C2.3026 13.5729 1.98872 13.4424 1.7276 13.1813C1.46649 12.9201 1.33594 12.6063 1.33594 12.2396V4.23958C1.33594 3.87292 1.46649 3.55903 1.7276 3.29792C1.98872 3.03681 2.3026 2.90625 2.66927 2.90625H13.3359C13.7026 2.90625 14.0165 3.03681 14.2776 3.29792C14.5387 3.55903 14.6693 3.87292 14.6693 4.23958V12.2396C14.6693 12.6063 14.5387 12.9201 14.2776 13.1813C14.0165 13.4424 13.7026 13.5729 13.3359 13.5729H2.66927ZM8.0026 8.90625L2.66927 5.57292V12.2396H13.3359V5.57292L8.0026 8.90625ZM8.0026 7.57292L13.3359 4.23958H2.66927L8.0026 7.57292ZM2.66927 5.57292V4.23958V12.2396V5.57292Z"
                      fill="#0A0A0A" />
                  </svg>
                 ${technicianDetails.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Important Reminders Section -->
        <div class="reminders-section">
          <h3 class="reminders-title">Important Reminders</h3>

          <ul class="reminders-list">
            <li class="reminder-item">Please arrive 10 minutes before your scheduled appointment time.</li>
            <li class="reminder-item">If you need to reschedule, please contact us at least 24 hours in advance.</li>
            <li class="reminder-item">Bring any relevant documents or information related to your service.</li>
          </ul>
        </div>

        <!-- Divider -->
        <hr class="divider">

        <!-- Thanks Message -->
        <h2 class="thanks-title">Thanks For Choosing Us!</h2>

        <!-- Contact Info -->
        <p class="contact-info">Contact us if you have any questions or need to reschedule</p>

        <!-- Phone Button -->
        <a href="tel:+16232130349" class="phone-button">
          <span class="phone-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5366_42391)">
                <path
                  d="M22.7327 17.8349C21.7364 16.8386 20.7427 15.8422 19.7463 14.8485C18.9562 14.0182 17.9197 14.0182 17.0894 14.8485C16.468 15.4699 15.8439 16.0913 15.2226 16.7154C15.0565 16.8814 14.9306 16.8814 14.7244 16.7984C14.3494 16.5493 13.8941 16.3833 13.5191 16.1342C11.7353 15.0146 10.2006 13.5602 8.8721 11.8996C8.20786 11.0693 7.62664 10.1989 7.21148 9.20251C7.12847 8.99627 7.12847 8.8704 7.29453 8.70434C7.95876 8.12312 8.53998 7.50175 9.16135 6.96071C10.0345 6.09024 10.0345 5.09387 9.16135 4.22339C8.62299 3.68237 8.165 3.22704 7.66951 2.72887C7.12847 2.19051 6.63029 1.69234 6.13212 1.19414C5.34465 0.404035 4.30547 0.404035 3.47783 1.19414C2.85378 1.81553 2.23241 2.43692 1.60832 3.06099C1.02714 3.64219 0.73785 4.34661 0.654804 5.13673C0.571791 6.42235 0.861045 7.66781 1.31904 8.8704C2.23241 11.4015 3.64389 13.5602 5.34465 15.5931C7.62664 18.3331 10.4068 20.5321 13.6021 22.0695C15.0565 22.7337 16.551 23.3149 18.1259 23.3979C19.2883 23.4381 20.2445 23.1489 21.032 22.2757C21.5703 21.6945 22.1944 21.1561 22.7327 20.5749C23.563 19.7018 23.563 18.6652 22.7327 17.8349Z"
                  fill="white" />
              </g>
              <defs>
                <clipPath id="clip0_5366_42391">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          ${TenantPhoneNumber || 'N/A'}
        </a>
      </div>

      <!-- Footer -->
      <div class="footer">
        <h3 class="footer-title">${BusinessName}</h3>
        <p class="footer-text">© 2025 ${BusinessName}. All rights reserved.</p>
      </div>

    </div>
  </div>
</body>
</html>
  `;

  return htmlTemplate;
};

export const generateEmailTemplateForInvoice = (
  LogoUrl: string,
  BusinessName: string,
  companyPrefix: string,
  invoiceNumber: string,
  customerDetails: {
    name: string;
    addressDetail: {
      streetAddress: string;
      country: string;
      state: string;
      zipcode: string;
      city: string;
    };
    phoneNumber: string;
    email: string;
  },
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[],
  totalAmount: number,
) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice from ${BusinessName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; color: #333333; margin: 0; padding: 20px; background-color: #f9f9f9;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <!-- Invoice Header -->
        <tr>
        <td style="padding: 20px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="width: 70%;">
            <div style="font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0072BC;">Invoice</div>
            <div style="font-size: 18px; opacity: 0.9; margin-top: 5px; color: #0072BC;">${BusinessName}</div>
            <div style="margin-top: 5px;">Invoice #: ${invoiceNumber}</div>
            </td>
            <td>
            <img
              src="${LogoUrl}"
              alt="${BusinessName}"
              style="max-height: 60px; max-width: 200px; margin: 0 auto;"
            />
            </td>
          </tr>
          </table>
        </td>
        </tr>

        <!-- Invoice Body -->
        <tr>
        <td style="padding: 0 20px 20px 20px;">
          <!-- Addresses -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
          <tr>
            <td style="width: 48%; vertical-align: top;">
            <div style="font-size: 14px; text-transform: uppercase; color: #0072BC; font-weight: 600; border-bottom: 2px solid #f1f1f1; padding-bottom: 8px; margin-bottom: 12px; letter-spacing: 1px;">From</div>
            <div style="line-height: 1.5; font-size: 14px;">
              <div style="font-weight: bold;">${BusinessName}</div>
              <div>123 Business Street</div>
              <div>City, State 12345</div>
              <div>Phone: (123) 456-7890</div>
              <div>Email: contact@${companyPrefix}.com</div>
            </div>
            </td>
            <td style="width: 4%;">&nbsp;</td>
            <td style="width: 48%; vertical-align: top;">
            <div style="font-size: 14px; text-transform: uppercase; color: #0072BC; font-weight: 600; border-bottom: 2px solid #f1f1f1; padding-bottom: 8px; margin-bottom: 12px; letter-spacing: 1px;">Bill To</div>
            <div style="line-height: 1.5; font-size: 14px;">
              <div style="font-weight: bold;">
              ${customerDetails ? `${customerDetails?.name}` : 'John Doe'}  
              </div>
              </div>
              <div>${customerDetails.addressDetail.streetAddress}</div>
              <div>${customerDetails.addressDetail.city},${customerDetails.addressDetail.state} ${customerDetails.addressDetail.zipcode}</div>
              <div>${customerDetails.addressDetail.country}</div>
              <div>Phone: ${customerDetails?.phoneNumber || '(555) 123-4567'}</div>
              <div>Email: ${customerDetails?.email || 'johndoe@example.com'}</div>
            </div>
            </td>
          </tr>
          </table>

          <!-- Invoice Details -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; border-radius: 4px; margin-bottom: 25px;">
          <tr>
            <td style="width: 33.33%; padding: 15px; vertical-align: top;">
            <div style="font-size: 12px; text-transform: uppercase; color: #666; font-weight: 600; margin-bottom: 5px;">Issue Date</div>
            <div style="font-size: 16px; font-weight: 600;">${moment.utc().format('MM-DD-YYYY')}</div>
            </td>
            <td style="width: 33.33%; padding: 15px; vertical-align: top;">
            <div style="font-size: 12px; text-transform: uppercase; color: #666; font-weight: 600; margin-bottom: 5px;">Due Date</div>
            <div style="font-size: 16px; font-weight: 600;">${moment.utc().add(30, 'days').format('MM-DD-YYYY')}</div>
            </td>
            <td style="width: 33.33%; padding: 15px; vertical-align: top;">
            <div style="font-size: 12px; text-transform: uppercase; color: #666; font-weight: 600; margin-bottom: 5px;">PO Number</div>
            <div style="font-size: 16px; font-weight: 600;">${`PO-${moment.utc().format('YYYY')}-${String(
              Math.floor(Math.random() * 1000),
            ).padStart(3, '0')}`}</div>
            </td>
          </tr>
          </table>

          <!-- Invoice Items -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
          <thead>
            <tr>
            <th style="background-color: #333333; color: white; text-align: left; padding: 12px; font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; width: 50%;">Description</th>
            <th style="background-color: #333333; color: white; text-align: right; padding: 12px; font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; width: 15%;">Quantity</th>
            <th style="background-color: #333333; color: white; text-align: right; padding: 12px; font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; width: 15%;">Unit Price</th>
            <th style="background-color: #333333; color: white; text-align: right; padding: 12px; font-weight: 600; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; width: 20%;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items
              ?.map(
                (item) => `
            <tr>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 500;">${item?.name}</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">${item?.quantity}</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">$${item?.unitPrice?.toFixed(
                2,
              )}</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right;">$${item?.unitPrice?.toFixed(
                2,
              )}</td>
            </tr>
            `,
              )
              .join('')}
          </tbody>
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
          <tr>
            <td style="width: 60%;">&nbsp;</td>
            <td style="width: 40%;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
              <td style="font-size: 18px; font-weight: bold; color: #0072BC; padding: 10px 0;">Total Due</td>
              <td style="font-size: 18px; font-weight: bold; color: #0072BC; text-align: right; padding: 10px 0;">$${totalAmount.toFixed(
                2,
              )}</td>
              </tr>
            </table>
            </td>
          </tr>
          </table>

          <!-- Payment Information -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; border-radius: 4px; margin-bottom: 25px;">
          <tr>
            <td style="padding: 20px;">
            <div style="font-size: 16px; font-weight: 600; color: #444; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 0.5px;">Payment Information</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
              <td style="width: 50%; padding-bottom: 10px; vertical-align: top;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Bank Name</div>
                <div style="font-weight: 600;">HSBC</div>
              </td>
              <td style="width: 50%; padding-bottom: 10px; vertical-align: top;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Account Name</div>
                <div style="font-weight: 600;">${BusinessName}</div>
              </td>
              </tr>
              <tr>
              <td style="width: 50%; vertical-align: top;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Account Number</div>
                <div style="font-weight: 600;">1234567890</div>
              </td>
              <td style="width: 50%; vertical-align: top;">
                <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Routing Number</div>
                <div style="font-weight: 600;">987654321</div>
              </td>
              </tr>
            </table>
            </td>
          </tr>
          </table>
        </td>
        </tr>

        <!-- Invoice Footer -->
        <tr>
        <td style="padding: 0 20px 30px 20px; text-align: center;">
          <div style="font-size: 20px; font-weight: 600; color: #0072BC; margin-bottom: 10px;">Thank You for Your Business!</div>
          <div style="font-size: 14px; color: #666; line-height: 1.5;">
          If you have any questions about this invoice, please contact us at<br>
          support@${companyPrefix}.com or call (123) 456-7890
          </div>
        </td>
        </tr>
      </table>
      </body>
    </html>
    `;
  return htmlTemplate;
};

export const sendEmailWithContentForInvoice = async (
  LogoUrl: string,
  BusinessName: string,
  companyPrefix: string,
  invoiceNumber: string,
  customerDetails: {
    name: string;
    addressDetail: {
      streetAddress: string;
      country: string;
      state: string;
      zipcode: string;
      city: string;
    };
    phoneNumber: string;
    email: string;
  },
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[],
  totalAmount: number,
  sourceEmail: string,
) => {
  const {
    AWS: { REGION: region },
  } = getConfig();
  logger.info('Email called');

  const sesClient = new SESClient({ region });

  const htmlContent = generateEmailTemplateForInvoice(
    LogoUrl,
    BusinessName,
    companyPrefix,
    invoiceNumber,
    customerDetails,
    items,
    totalAmount,
  );
  try {
    const recipientEmails = [customerDetails.email];
    const subject = `${BusinessName} - Customer Invoice Details`;

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: [...recipientEmails],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlContent,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: sourceEmail,
      ReplyToAddresses: [],
    });

    await sesClient.send(sendEmailCommand);

    logger.info('Email sended successfully');

    return;
  } catch (error) {
    logger.error(`Error sending Mail ${error}`);
    throw new Error('Invoice updated but error get at sending Mail');
  }
};

export const sendEmailWithContentForAppointment = async (
  LogoUrl: string,
  BusinessName: string,
  companyPrefix: string,
  sourceEmail: string,
  TenantPhoneNumber: string,
  appointmentDetails: {
    id: string;
    customerName: string;
    email: string;
    phoneNumber: string;
    address: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    serviceType?: string;
    notes?: string;
    status: 'Scheduled' | 'Rejected' | 'Completed' | string;
    appointmentReschedule?: boolean;
    rejectReason?: string;
  },
  technicianDetails?: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
  },
) => {
  const {
    AWS: { REGION: region },
  } = getConfig();
  logger.info('Appointment Email called');
  logger.info(`Appointment Details: ${JSON.stringify(appointmentDetails)}`);
  const sesClient = new SESClient({ region });

  const htmlContent = generateEmailTemplateForAppointment(
    LogoUrl,
    BusinessName,
    TenantPhoneNumber,
    companyPrefix,
    appointmentDetails,
    technicianDetails,
  );

  try {
    const recipientEmails = [appointmentDetails.email];

    // Customize subject based on appointment status and reschedule flag
    let subject = `${BusinessName} - `;
    if (appointmentDetails.status === 'Scheduled') {
      subject += appointmentDetails.appointmentReschedule ? 'Appointment Rescheduled' : 'Appointment Confirmation';
    } else if (appointmentDetails.status === 'Rejected') {
      subject += 'Appointment Rejected';
    } else if (appointmentDetails.status === 'Completed') {
      subject += 'Appointment Completed';
    } else {
      subject += 'Appointment Update';
    }

    const sendEmailCommand = new SendEmailCommand({
      Destination: {
        ToAddresses: [...recipientEmails],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlContent,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: sourceEmail,
      ReplyToAddresses: [],
    });

    await sesClient.send(sendEmailCommand);

    return;
  } catch (error) {
    logger.error(`Error sending appointment email: ${error}`);
    throw new Error('Appointment updated but error occurred while sending email');
  }
};
