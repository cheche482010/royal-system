// api/src/utils/securityMiddleware.js
const helmet = require('helmet');

const securityMiddleware = () => {
  return [
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com']
      }
    }),
    helmet.frameguard({ action: 'deny' }),
    helmet.xssFilter(),
    helmet.noSniff()
  ];
};

module.exports = securityMiddleware;