const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/etsy',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      pathRewrite: {
        '^/etsy/': '/', // remove base path
      },
    })
  );
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