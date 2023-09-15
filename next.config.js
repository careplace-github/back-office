const dotenv = require('dotenv');

if (process.env.ENV) {
  // configure dotenv
  dotenv.config({ path: `.env.${process.env.ENV}` });
}

module.exports = {
  swcMinify: false,
  trailingSlash: false,

  async redirects() {
    // https://nextjs.org/docs/api-reference/next.config.js/redirects
    return [
      {
        source: '/',
        // Only use while home page is under construction
        destination: '/health-units',
        permanent: false,
      },
    ];
  },
};
