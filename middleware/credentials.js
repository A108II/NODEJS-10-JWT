const whiteList = require('../config/whiteList');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if(whiteList.includes(origin) && !res.headersSent){
    res.header('Acess-Control-Allow-Credntials', true);
  }
}
module.exports = credentials;