/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/broadside', destination: '/broadside/index.html', permanent: false },
      { source: '/tyler', destination: '/tyler/index.html', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/broadside/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
      {
        source: '/tyler/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
      },
    ];
  },
};

export default nextConfig;

