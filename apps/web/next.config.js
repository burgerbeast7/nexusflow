/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isGitHubPages ? '/nexusflow' : '',
  assetPrefix: isGitHubPages ? '/nexusflow/' : '',
  images: {
    unoptimized: true,
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com'],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
