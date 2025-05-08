const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://bob-stag-api-ca.purpletree-3fe217f5.centralindia.azurecontainerapps.io/admin/api',
      changeOrigin: true
    })
  );
};