/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. 允许外部图片域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'img.scdn.io',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      // 如果你有其他图床域名，请继续添加
    ],
    // 2. 启用 AVIF 格式，压缩率更高
    formats: ['image/avif', 'image/webp'],
  },
  // 3. 实验性功能 (可选，视情况而定)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;