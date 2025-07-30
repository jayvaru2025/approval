import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
export const getObject = async (bucket: string, key: string) => {
  const s3 = new S3Client({ region: 'us-east-1' });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return await s3.send(command);
};
