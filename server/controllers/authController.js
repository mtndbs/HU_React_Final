// eslint-disable-next-line node/no-unsupported-features/node-builtins
const validator = require('validator');
const jwt = require('jsonwebtoken');
// const _ = require('lodash');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // for more simple hashed token (reseting password)
const User = require('./../models/userModel');
const Email = require('./../utils/email');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
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

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
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

exports.signUp = catchAsync(async (req, res, next) => {
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
    return next(new AppError('This Email already exist', 409));
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

  const token = signToken(newUser._id, newUser.bizChecked);
  if (!token) {
    return next(
      new AppError('There was problem with your authentication, please sign again', 401)
    );
  }

  await new Email(newUser, 'http://localhost:3000/').sendWelcome();

  res.status(200).json({
    name: newUser.name,
    email: newUser.email,
    bizChecked: newUser.bizChecked,
    token: token,
    favorites: newUser.favorites,
    _id: newUser._id,
    role: newUser.role
  });
});
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email) || !password) {
    return next(new AppError('Email or password not currectly typed', 400));
  }
  const user = await User.findOne({ email }).select('+password'); // +password because password set to select false
  if (!user || user.active === false) {
    return next(new AppError('email or passwrod are invalid', 400));
  }

  if (oneDayCloseFunc(user.userBlockedAt)) {
    user.userBlocked = false;
  }

  if (user.userBlocked) {
    return next(
      new AppError('To many failed login requests , User blocked for 24 Hours', 400)
    );
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
    return new AppError(
      'There was problem with your authentication, please sign again',
      401
    );
  }

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
});

//==========================Reseting password ====================== not required

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'there is no user with this email' });
  }
  try {
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
    const LocalResetPageURL = `http://localhost:3000/reset-password/${resetToken}`;

    await new Email(user, LocalResetPageURL).sendPasswordReset();

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

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    return new AppError('Token is invalid or has expired', 401);
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  const token = signToken(user._id, user.bizCheckedChecked);
  res.status(200).json({
    status: 'success',
    name: user.name,
    email: user.email,
    bizChecked: user.bizChecked,
    token: token,
    favorites: user.favorites,
    _id: user._id,
    role: user.role
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirmPassword, currentPassword } = req.body;
  if (!password || !confirmPassword || !currentPassword) {
    return new AppError('missing one of the values', 404);
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return new AppError('email or passwrod are invalid', 400);
  }
  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  const token = signToken(user._id, user.bizChecked);

  res.status(201).json({
    status: 'success',
    token
  });
});
