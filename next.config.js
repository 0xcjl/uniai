

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'api.stability.ai',
        },
      ],
    },
  }
  
  module.exports = nextConfig