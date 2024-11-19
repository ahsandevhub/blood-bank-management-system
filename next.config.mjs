/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2"], // External package configuration
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // Ensuring JWT_SECRET is available in the environment
  },
};

export default nextConfig;
