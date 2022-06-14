/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.inoreader.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/inoreader/:path*',
        destination: `${process.env.INOREADER_SERVER_URL}/:path*`,
      }]
  },
  pwa: {
    dest: "/public",
    register: true,
    skipWaiting: true,
    // disable: process.env.NODE_ENV === "development",
  }
}

module.exports = withPWA(nextConfig)
