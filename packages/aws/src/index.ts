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

const ONE_HOUR_SECONDS = 60 * 60;
const SIXTEEN_MB_BYTES = 1024 * 1024 * 16;

export type Resource = "avatars" | "banners";

export const getSignedUrl = <T>(
  key: T extends `${Resource}/${string}` ? T : never,
) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME,
    Key: key,
    Expires: ONE_HOUR_SECONDS,
  });
};

export const postSignedUrl = <T>(
  key: T extends `${Resource}/${string}` ? T : never,
) => {
  return s3.createPresignedPost({
    Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME,
    Fields: { key },
    Conditions: [["content-length-range", 0, SIXTEEN_MB_BYTES]],
  });
};
