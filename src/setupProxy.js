const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://print.madsunshinecreations.com',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api/': '/', // remove base path
      // },
    })
  );
};