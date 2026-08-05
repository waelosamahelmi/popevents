/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/register.html', destination: '/register', permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
