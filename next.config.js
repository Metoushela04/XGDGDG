/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: process.env.NODE_ENV === 'development' 
    ? [
        '3000-i1dpl5xa2l3svglza1fhp.e2b.app',
        '*.e2b.app',
      ]
    : [],
};

module.exports = nextConfig;
