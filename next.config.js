/** @type {import('next').NextConfig} */

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
  }
}

module.exports = nextConfig
