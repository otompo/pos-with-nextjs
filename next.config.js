module.exports = {
  reactStrictMode: true,
  env: {
    DB_URI:
      'mongodb+srv://sasco:UcGGroZRklB1WjDy@cluster0.urp0n.mongodb.net/afrotaliandb?retryWrites=true&w=majority',
    DB_LOCAL: 'mongodb://localhost:27017/posdb',
    CLIENT_URL: 'http://localhost:3000',
    JWT_SECRET: 'sfskftsfdssdsp3405059o53H530smdslf',
    JWT_COOKIE_EXPIRES_IN: '50',
    AWS_BUCKET: 'afrotalian-bucket',
    AWS_ACCESS_KEY_ID: 'AKIAZQJ5SNLB3NQVBH42',
    AWS_SECRET_ACCESS_KEY: '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',
    AWS_REGION: 'us-west-2',
    AWS_API_VERSION: '2012-10-17',
    EMAIL_FROM: 'pos@gmail.com',
    NEXTAUTH_URL: 'https://pos.com',
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};