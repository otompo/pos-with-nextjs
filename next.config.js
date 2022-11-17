module.exports = {
  reactStrictMode: true,
  env: {
    DB_URL: '',
    JWT_SECRET: '',
    JWT_COOKIE_EXPIRES_IN: '',
    NEXTAUTH_URL: '',
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
