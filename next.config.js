/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'avatars.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/socket.io`,
      },
    ];
  },
};

module.exports = nextConfig;
