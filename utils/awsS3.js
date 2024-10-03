// utils/awsS3.js (or awsS3.ts if using TypeScript)
import AWS from 'aws-sdk';

// Configure AWS with your credentials and region from environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an instance of S3
const s3 = new AWS.S3();

/**
 * Get a pre-signed URL for a file in S3
 * @param {string} bucketName - Your S3 bucket name
 * @param {string} fileName - The name of the file in your S3 bucket
 * @returns {string} - Pre-signed URL to access the file
 */
export const getSignedUrl = (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 60 * 5, // URL will expire in 5 minutes
  };
  return s3.getSignedUrl('getObject', params);
};
