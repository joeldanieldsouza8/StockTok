import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5170/api/:path*', // Matches your ASP.NET Core API
      },
    ];
  },
};

export default nextConfig;
