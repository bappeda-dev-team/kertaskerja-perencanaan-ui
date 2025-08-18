/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/perencanaan",
  assetPrefix: "/perencanaan/",
    images: {
        domains: ['logo.kertaskerja.cc'],
    },
    output: "standalone",
};

export default nextConfig;
