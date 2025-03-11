/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Add any Next.js 15 experimental features you need
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig