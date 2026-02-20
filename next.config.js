/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes on Vercel
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
