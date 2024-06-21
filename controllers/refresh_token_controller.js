// 400: bad request, use when the request in invalid, like missing required filed or invalid data format
// 401: Unauthorized, client must authenticate itself to get the requested response
// 403: Forbidden, client is authenticated but doesn't have a permission to get the requested response like a logged user tries to access admin-only page

const user_db = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Get cookie
const handleRefreshToken = (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.jwt) {
    console.log("No cookie found");
    return res.sendStatus(401)
  }
// Compare refresh token with the refresh token in database
  const refreshToken = cookie.jwt;
  console.log(refreshToken);
  const token_match = user_db.users.find(user => user.refreshToken === refreshToken); 
  if (!token_match) {
    console.log("Could not find corresponding user with specific refresh token")
    return res.sendStatus(403);
  }

// Verify refresh token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err) { return res.sendStatus(403); }
      // Compare username in database with decoded username 
      if (token_match.username !== decoded.username) { return res.sendStatus(403); }
      // Issue new access token
      const access_token = jwt.sign(
      {"username": decoded.username},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: '60s'})
      return res.json({access_token});
      }
    )
}

module.exports = {handleRefreshToken};




