/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "ipfs.io",
      "trazabilidadideal.infura-ipfs.io",
    ],
  },
};

module.exports = nextConfig;
