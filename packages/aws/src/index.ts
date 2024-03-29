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

export type Resource = "attachments" | "avatars" | "banners";

export const getSignedUrl = <T>(
  key: T extends `${Resource}/${string}` ? T : never,
) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME!,
    Expires: ONE_HOUR_SECONDS,
    Key: key,
  });
};

export const postSignedUrl = <T>(
  key: T extends `${Resource}/${string}` ? T : never,
) => {
  return s3.createPresignedPost({
    Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME!,
    Conditions: [
      ["content-length-range", 0, SIXTEEN_MB_BYTES],
      ["starts-with", "$Content-Type", "image/"],
    ],
    Fields: { key },
  });
};

export const deleteObjects = <T>(
  keys: T extends `${Resource}/${string}`[] ? T : never,
) => {
  return new Promise<S3.DeletedObjects>((resolve, reject) => {
    s3.deleteObjects(
      {
        Bucket: process.env.AWS_S3_ASSETS_BUCKET_NAME!,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      },
      (err, res) => {
        if (!res) {
          reject(err);
          return;
        }

        if (res.Errors && res.Errors.length > 0) {
          reject(res.Errors);
          return;
        }

        if (!res.Deleted) {
          throw new Error();
        }

        resolve(res.Deleted);
      },
    );
  });
};
