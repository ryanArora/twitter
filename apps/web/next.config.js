/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "s3.ca-central-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
