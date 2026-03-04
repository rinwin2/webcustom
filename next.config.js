/** @type {import('next').NextConfig} */
const nextConfig = {
  publicRuntimeConfig: {
    SERVER_URL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'localhost',
      'webcustom-seven.vercel.app', // Thêm domain vercel của bạn vào đây
    ],
  },
};

module.exports = nextConfig;