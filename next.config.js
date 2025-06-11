// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Configuration pour Next.js 14
  },
  // Configuration pour le développement
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
