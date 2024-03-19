/** @type {import('next').NextConfig} */
module.exports = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'cdn-soar.qingtime.cn',
        port: '',
        pathname: '/**'
      }
    ]
  }
}
