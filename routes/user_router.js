'use strict';
const express = require('express');
const router = express.Router();
const validator = require('validator');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user_model');
const middlewares = require('../src/middlewares');

router.get('/protected', middlewares.ensureLoggedIn, (req, res, next) => {
  res.json({ protected: 'you accessed protected route' });
});

// "/api/users/authenticate"
router.post('/auth', middlewares.ensureLoggedIn, (req, res) => {
  const payload = getPayload(req.user);
  res.json(payload);
});

// "/api/users/register"
router.post(
  '/register',
  middlewares.ensureNotLoggedIn,
  validateRegisterParams(),
  async (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      // There are validation errors, send them to client
      const msgs = errors.map(error => {
        return { error: error.msg };
      });
      return res.status(400).json(msgs);
    }

    // Check if username is already in database
    else if (await User.findOne({ username: req.body.username })) {
      return res.json({ error: 'username already exists please login' });
    }

    // Check if email is already in database
    else if (await User.findOne({ email: req.body.email })) {
      return res.json({ error: 'email already exists' });
    }

    // User does not exist, create one and save to DB
    else {
      const { username, email, password } = req.body;
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });
      const user = await newUser.save();

      const token = await jwt.sign(getPayload(user), process.env.JWT_KEY);
      res.currentUser = user;
      res.json({ token });
    }
  }
);

// "/api/users/login"
router.post('/login', middlewares.ensureNotLoggedIn, async (req, res, next) => {
  const { username, password } = req.body;

  // Find user in database
  let user = await User.findOne({ username });

  // Username not found in database, send error rsmessage
  if (!user) return res.json({ error: 'Invalid username' });
  const passwordMatch = await bcrypt.compare(password, user.password);

  // Password is incorrect, send error message
  if (!passwordMatch) return res.json({ error: 'Invalid password' });

  // username and password are correct so log in
  const token = await jwt.sign(getPayload(user), process.env.JWT_KEY);
  const decoded = await jwt.verify(token, process.env.JWT_KEY);
  res.json({ token, decoded });
});

function validateRegisterParams() {
  const validations = [
    body('username', 'username must be between 3 and 30 characters')
      .trim()
      .isLength({ min: 3 })
      .isLength({ max: 30 }),
    body('email', 'email must be formatted properly')
      .trim()
      .isEmail(),
    body('password', 'password must be between 6 and 30 characters')
      .trim()
      .isLength({ min: 6 })
      .isLength({ max: 30 })
  ];
  return validations;
}

function getPayload(user) {
  const payLoad = {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    }
  };
  return payLoad;
}

module.exports = router;
