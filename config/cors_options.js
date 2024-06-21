const whiteList = require('./whiteList');
// Here I define webite domains that can make a request and access to the backend node server. 
const cors_options = {
  origin: (origin, callback) => {
    // if the domain is in the whiteList, !origin = undefined or null, when we make a request from localhost:3500 it outputs the req.headers.origin as undefined, in order to solve this issue we add || !origin 
    if (whiteList.indexOf(origin) != -1 || !origin) {
      callback(null, true)
    }
    else {
      callback(new Error('Not allowed by the cors'))
    }
  },
  optionSuccessStatus: 200,
}

module.exports = cors_options;
