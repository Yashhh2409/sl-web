/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    domains: ["sl-api-tjtm.onrender.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/uploads/:path*",
        destination: "http://localhost:3333/uploads/:path*",
      },
      {
        source: "/api/recent-image",
        destination: "http://localhost:3333/recent-image",
      },
    ];
  },
};

export default nextConfig;
