/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pbs.twimg.com",
      },
      {
        hostname: "s3.ca-central-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
