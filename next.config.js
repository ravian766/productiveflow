/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Enable page bundle analyzer in production build
  // Run 'ANALYZE=true npm run build' to generate bundle analysis
  webpack: (config, { isServer, dev }) => {
    // Enable webpack bundle analyzer only in production
    if (!dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
        })
      )
    }
    return config
  },

  // Experimental features for better performance
  experimental: {
    // Enable server actions
    serverActions: true,
    // Enable optimistic updates
    optimisticClientCache: true,
    // Enable modern JavaScript features
    modernBuild: true,
  },
}
