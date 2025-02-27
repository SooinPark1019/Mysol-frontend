/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.editorialhub.site/api/:path*",
      },
    ];
  },
};

export default nextConfig;
