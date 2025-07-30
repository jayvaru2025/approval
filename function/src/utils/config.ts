export const getConfig = () => {
  return {
    SERVER: {
      STAGE: process.env.STAGE,
    },
    AWS: {
      REGION: process.env.REGION || 'us-east-1',
    },
    SQS_URL: process.env.SQS_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'digitelco_token_use1_dev',
    SOURCE_EMAIL_ADDRESS: process.env.SOURCE_EMAIL_ADDRESS,
    DOMAIN: process.env.DOMAIN,
  };
};
