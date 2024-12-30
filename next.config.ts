/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withVercelToolbar = require("@vercel/toolbar/plugins/next")();

export default withVercelToolbar(nextConfig);
