const express = require('express');
const utils = require('../utils');


const route = express.Router();


const userData = {
    userId: "789789",
    password: "123456",
    name: "umer hasan",
    username: "umerhasan97",
    isAdmin: true
  };


route.post('/admin/login', function (req, res) {
    const user = req.body.username;
    const pwd = req.body.password;
  
    // return 400 status if username/password is not exist
    if (!user || !pwd) {
      return res.status(400).json({
        error: true,
        message: "Username or Password required."
      });
    }
  
    // return 401 status if the credential is not match.
    if (user !== userData.username || pwd !== userData.password) {
      return res.status(401).json({
        error: true,
        message: "Username or Password is Wrong."
      });
    }

    const token = utils.generateToken(userData);
    // get basic user details
    const userObj = utils.getCleanUser(userData);
    // return the token along with user details
    return res.json({ user: userObj, token });
});

module.exports = route;

