const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/nextjs-editor',
  images: {
    unoptimized: true,
  },
};

module.exports = removeImports(nextConfig);
