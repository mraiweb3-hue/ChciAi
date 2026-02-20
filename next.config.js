/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone mode for Render deployment
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
