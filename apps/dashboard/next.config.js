/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cyclical.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
