const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getUser = catchAsync(async (req, res, next) => {
  //  Verifiy token
  const decoded = req.user;
  const currentUser = await User.findById(decoded.id);

  const {
    name,
    lastName,
    email,
    phone,
    country,
    city,
    street,
    houseNumber,
    zip,
    image,
    imageAlt
  } = currentUser;
  res.status(200).json({
    name,
    lastName,
    email,
    phone,
    country,
    city,
    street,
    houseNumber,
    zip,
    image,
    imageAlt
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find({}).sort({ active: 1 });
  if (!allUsers) {
    return next(new AppError('There are no users to serve', 400));
  }
  res.status(200).json(allUsers);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const {
    name,
    lastName,
    email,
    country,
    city,
    street,
    houseNumber,
    zip,
    image,
    imageAlt
  } = req.body;

  const upDatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      lastName,
      email,
      country,
      city,
      street,
      houseNumber,
      zip,
      image,
      imageAlt
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: 'success', data: upDatedUser });
});

exports.adminSetUp = catchAsync(async (req, res, next) => {
  const { _id, bizChecked, active } = req.body;

  const currentUser = await User.findById(_id);
  currentUser.bizChecked = bizChecked;
  currentUser.active = active;

  const data = await currentUser.save();
  res.status(200).json({ status: 'success', data: data });
});

exports.userDelete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('problem with URL details', 400));
  }
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    return next(new AppError('There is no such Id', 404));
  }
  res.status(204).json({
    status: 'item has been deleted',
    data: null
  });
});
