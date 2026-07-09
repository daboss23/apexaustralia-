/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Directory-style URLs (/success/ → success/index.html) so exported routes
  // resolve on any static host without clean-URL rewrites.
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
