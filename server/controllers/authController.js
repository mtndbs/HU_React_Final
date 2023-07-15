// eslint-disable-next-line node/no-unsupported-features/node-builtins
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // for more simple hashed token (reseting password)
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');
// Token sign function

const oneDayCloseFunc = date => {
  if (date) {
    const funcDate = new Date(date);
    const today = new Date();
    const differenceInTime = Math.abs(funcDate.getTime() - today.getTime());
    const dayInMillseconds = 1000 * 60 * 60 * 24;
    return differenceInTime >= dayInMillseconds;
  }
  return false;
};

const signToken = (id, bizChecked) => {
  return jwt.sign({ id, bizChecked }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
const cookieOptions = {
  expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
  // secure: true,  //on development, secure will be false
  httpOnly: true
};
// ============================== secuirity middleware ===================================
exports.protector = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'Fail',
        message: 'You are not logged in! Please log in to get access'
      });
    }

    // verifiy token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // sending the user details inside the req object to the endpoint
    //check if user still exists
    const currentUser = await User.findById(decoded.id);
    // reseting the login blocked by protect middleware
    req.user = currentUser;

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        massage: 'The user belonging to this token does no longer exist.'
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
// ================== end of security middleware ==========================

// ============================ AuthGuard =====================================
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles [ 'admin']. role='user'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

// ================================= AuthGuard  ======================================

exports.signUp = async (req, res) => {
  try {
    const {
      name,
      lastName,
      password,
      phone,
      email,
      street,
      confirmPassword,
      image,
      country,
      city,
      houseNumber,
      zip,
      bizChecked
    } = req.body;

    const duplicateEmail = await User.findOne({ email: email });
    if (duplicateEmail) {
      return res
        .status(409)
        .json({ status: 'fail', message: 'This Email already exist' });
    }
    const newUser = await User.create({
      name,
      lastName,
      password,
      phone,
      email,
      street,
      confirmPassword,
      image,
      country,
      city,
      houseNumber,
      zip,
      bizChecked
    });
    res.status(200).json({
      status: 'success',
      data: _.pick(newUser, ['_id', 'name', 'email']),
      message: 'user has been registered successfully'
    });
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email) || !password) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Email or password not currectly typed' });
    }
    const user = await User.findOne({ email }).select('+password'); // +password because password set to select false
    if (!user || user.active === false) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'email or passwrod are invalid' });
    }

    if (oneDayCloseFunc(user.userBlockedAt)) {
      user.userBlocked = false;
    }

    if (user.userBlocked) {
      return res.status(400).json({
        status: 'fail',
        message: 'To many failed login requests , User blocked for 24 Hours'
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      if (user.loginTrys < 3) {
        user.loginTrys += 1;
      }
      if (user.loginTrys >= 3) {
        user.userBlocked = true;
        user.userBlockedAt = Date.now();
        user.loginTrys = 0;
      }
      const loginAttemps = 3 - user.loginTrys;
      user.save();

      return res.status(400).json({
        status: 'fail',
        message: 'Email or passwrod are invalid',
        trys: user.loginTrys,
        tryMessage: `Wrong username and password, you only have ${loginAttemps} more login attempts left`
      });
    }

    const token = signToken(user._id, user.bizChecked);
    if (!token) {
      return res.status(401).json({
        status: 'There was problem with your authentication, please sign again'
      });
    }

    res.cookie('jwt', token, cookieOptions);
    user.loginTrys = 0;
    user.save();

    res.status(200).json({
      name: user.name,
      email: user.email,
      bizChecked: user.bizChecked,
      token: token,
      favorites: user.favorites,
      _id: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

//==========================Reseting password ====================== not required

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404).json({ status: 'fail', message: 'there is no user with this email' });
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetpassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: 'fail',
      message: 'There was an error with the Email sending, please try again'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res
        .status(400)
        .json({ status: 'fail', message: 'Token is invalid or has expired' });
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const token = signToken(user._id, user.bizCheckedChecked);
    res.status(200).json({
      status: 'success',
      data: token
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updatePassword = async (req, res) => {
  const { password, confirmPassword, currentPassword } = req.body;
  if (!password || !confirmPassword || !currentPassword) {
    return res.status(404).json({ status: 'missing one of the values' });
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(400).json({ status: 'email or passwrod are invalid' });
  }
  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  const token = signToken(user._id, user.bizChecked);
  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    token: token
  });
};
