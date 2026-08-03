/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Directory-style URLs (/policies/privacy-policy/ -> .../index.html) so the
  // policy pages resolve on any static host without rewrite rules.
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
