module.exports = {
  reactStrictMode: true,
  env: {
    DB_URL:
      'mongodb+srv://sasco:oAPRV35UNyWLorpF@cluster0.fpvql.mongodb.net/posdb?retryWrites=true&w=majority',
    DB_LOCAL: 'mongodb://localhost:27017/posdb',
    JWT_SECRET: 'sfskftsfdssdsp3405059o53H530smdslf',
    JWT_COOKIE_EXPIRES_IN: '50',
    AWS_BUCKET: 'afrotalian-bucket',
    AWS_ACCESS_KEY_ID: 'AKIAZQJ5SNLB3NQVBH42',
    AWS_SECRET_ACCESS_KEY: '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',
    AWS_REGION: 'us-west-2',
    AWS_API_VERSION: '2012-10-17',
    NEXTAUTH_URL: 'https://pos.com',
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
