/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/tyler', destination: '/tyler/index.html', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/tyler/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

export default nextConfig;

