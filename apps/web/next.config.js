/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s3.ca-central-1.amazonaws.com",
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
