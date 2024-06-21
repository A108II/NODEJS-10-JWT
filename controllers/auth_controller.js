// Database
const user_db = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
}

// modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Handle user login 
const handleLogin = async (req, res) => {
  const { username, password } = req.body; // destructure username and password from req.body
  if (!username || !password) return res.status(400).json({ "message": "Bad request, please provide both username and password" });
  const foundUser = user_db.users.find(user => user.username === username); // founuser has the username and password retreived from the database

  if (!foundUser) {
    return res.status(400).json({ "message": "Could not find the corresponding username" })
  }

  const pwd_recognized = await bcrypt.compare(password, foundUser.password); // Compare password provided by the user and the password in the database
  if (pwd_recognized) {
    const accesToken = jwt.sign(
      { "username": foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '60s' },
    )  // access token contains header:HS256 1.alg: 2.typ:jwt + payload: { "username": foundUser.username, iat:1635485575 , exp:1635485605 } + Secret token
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' },
    )
    const usersExceptFoundUser = user_db.users.filter(user => user.username !== foundUser.username); // Create a new array containing all the users except current user
    const foundUserWithToken = { ...foundUser, refreshToken }; // Adding refresh token to the foundUser object
    user_db.setUsers([...usersExceptFoundUser, foundUserWithToken]); // Updating database, which contains all the users and foundUser with token
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'),
      JSON.stringify(user_db.users)
    )

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({ accesToken });
  }
}
module.exports = { handleLogin };
