/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'export',        // static HTML export
  trailingSlash: true,     // GitHub Pages compatibility
  images: { unoptimized: true },
  // If deployed under a sub-path (e.g. github.com/USER/REPO), set:
  // basePath: '/REPO_NAME',
  // assetPrefix: '/REPO_NAME/',
};
module.exports = nextConfig;
