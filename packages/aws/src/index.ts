import { S3 } from "aws-sdk";

if (
  !process.env.AWS_ACCESS_KEY ||
  !process.env.AWS_SECRET_ACCESS_KEY ||
  !process.env.AWS_REGION ||
  !process.env.AWS_S3_ASSETS_BUCKET_NAME
) {
  throw new Error("env");
}

export const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

const ONE_HOUR = 60 * 60;

export const getSignedUrl = async (
  operation: "putObject" | "getObject",
  resource: "avatars" | "banners",
  path: string,
) => {
  return s3.getSignedUrl(operation, {
    Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME,
    Key: `${resource}/${path}`,
    Expires: ONE_HOUR,
  });
};
