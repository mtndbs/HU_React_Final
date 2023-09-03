// eslint-disable-next-line node/no-unsupported-features/node-builtins
const multer = require('multer');
const Card = require('./../models/bCardModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getAllcards = catchAsync(async (req, res, next) => {
  const allCards = await Card.find({});
  res.status(200).json(allCards);
});

exports.createCard = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line camelcase
  const user_id = req.user.id;
  const {
    title,
    subTitle,
    description,
    phone,
    email,
    web,
    image,
    country,
    city,
    street,
    imageAlt,
    houseNumber,
    zip
  } = req.body;
  const newCard = await Card.create({
    title,
    subTitle,
    description,
    phone,
    email,
    web,
    image,
    imageAlt,
    country,
    city,
    street,
    houseNumber,
    zip,
    user_id
    // bPhoto: req.file ? req.file.filename : bPhoto
    // didnt use only with req.body, because security isues
  });

  res.status(200).json({
    status: 'success',
    data: newCard
  });
});

exports.getOneCard = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('problem with URL details', 400));
  }
  const oneCard = await Card.findById(id).select('-createdAt');
  if (!oneCard) {
    return next(new AppError('there is no such id', 404));
  }
  res.status(200).json(oneCard);
});

exports.upDateCard = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('problem with URL details', 400));
  }
  const oneCard = await Card.findByIdAndUpdate(id, req.body, {
    new: true, // new for returning the new object instead of the old one
    runValidators: true // running schema validation also when updating
  });
  if (!oneCard) {
    return next(new AppError('there is no such id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: oneCard
  });
});

exports.deleteCard = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError('problem with URL details', 400));
  }
  const deleted = await Card.findByIdAndDelete(id);
  if (!deleted) {
    return next(new AppError('there is no such id', 404));
  }
  res.status(204).json({
    status: 'item has been deleted',
    data: null
  });
});

exports.getMyCards = catchAsync(async (req, res, next) => {
  const decoded = req.user; // getting the user data from the middleware
  const myCards = await Card.find({ user_id: decoded.id }).select('-createdAt');

  res.status(200).json(myCards);
});

exports.setFavorite = catchAsync(async (req, res, next) => {
  const cardId = req.params.id;
  const userId = req.user.id;
  let status = false;

  const card = await Card.findById(cardId);
  const user = await User.findById(userId);
  if (!card) {
    return next(new AppError('Card not found', 404));
  }

  const cardIndex = card.favorites.indexOf(userId);
  const userIndex = user.favorites.indexOf(cardId);
  if (cardIndex === -1) {
    card.favorites.push(userId);
    status = true;
  } else {
    card.favorites.splice(cardIndex, 1);
    status = false;
  }
  if (userIndex === -1) {
    user.favorites.push(cardId);
  } else {
    user.favorites.splice(userIndex, 1);
  }

  await card.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });
  const { title } = card;

  return res.status(200).json({ title, status });
});

exports.getUserFavoriteCards = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('favorites');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const favoriteCards = user.favorites;

  return res.status(200).json({ favoriteCards });
});
// ============================== multer for uplaod files ==============================

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/img/cards');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  try {
    if (file.mimetype && file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid mime type'), false);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCardPhoto = upload.single('bPhoto');
