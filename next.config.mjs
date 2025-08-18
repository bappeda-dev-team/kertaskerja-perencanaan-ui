/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/perencanaan",
  assetPrefix: "https://nextcdn.kertaskerja.cc/perencanaan-ui",
    images: {
        domains: ['logo.kertaskerja.cc'],
    },
    output: "standalone",
};

export default nextConfig;
