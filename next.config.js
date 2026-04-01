const withMDX = require("@next/mdx")();

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  // Static export for GitHub Pages (production only)
  ...(isProduction && {
    output: 'export',
    basePath: '/cloudera-guides',
  }),
  // Required for static export
  images: {
    unoptimized: true,
  },
};

module.exports = withMDX(nextConfig);
