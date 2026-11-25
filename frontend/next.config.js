/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'localhost',
      '127.0.0.1',
      'adilabad.digitalcrowdtech.in'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'adilabad.digitalcrowdtech.in',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5010',
        pathname: '/uploads/**',
      }
    ]
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://adilabad.digitalcrowdtech.in'
  },
  async rewrites() {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api').replace(/\/api\/?$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin}/api/:path*`
      },
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
