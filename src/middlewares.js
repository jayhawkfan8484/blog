'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');

module.exports = {
  ensureLoggedIn: async function(req, res, next) {
    try {
      const decoded = await jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_KEY
      );
      const user = await User.findById(decoded.user._id);
      if (user) {
        req.user = user;
        next();
      } else {
        // 403 Forbidden
        res.sendStatus(403);
      }
    } catch (err) {
      // 401 Unauthorized
      res.sendStatus(401);
    }
  },
  ensureNotLoggedIn: async function(req, res, next) {
    try {
      const decoded = await jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_KEY
      );
      const user = await User.findById(decoded.user._id);
      if (user) {
        //403 Forbidden;
        req.user = user;
        res.sendStatus(403);
      } else {
        next();
      }
    } catch (err) {
      next();
    }
  }
};
