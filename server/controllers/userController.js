const multer = require('multer');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const { filterObj } = require('./../utils/helpFunc');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('not an image Please upload only image', 400), 'false');
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

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
  console.log(req.file);
  console.log('================');
  console.log(req.body);

  // const filterBody = filterObj();
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

  let photo;
  if (req.file) {
    photo = req.file.filename;
  }

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
      imageAlt,
      photo
    },
    { new: true, runValidators: false }
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
