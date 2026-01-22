/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'ipfs.io',
      'gateway.pinata.cloud',
      'trazabilidadideal.infura-ipfs.io',
      'harlequin-nearby-partridge-715.mypinata.cloud',
    ],
  },
};

module.exports = nextConfig;
