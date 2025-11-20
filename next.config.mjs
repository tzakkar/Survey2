/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip building static pages for dynamic routes during build
  experimental: {
    isrMemoryCacheSize: 0,
  },
  // Ensure dynamic routes don't try to generate during build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;

