/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Static HTML export
  distDir: "dist", // Custom build output directory
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
