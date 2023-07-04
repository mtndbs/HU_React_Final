// eslint-disable-next-line node/no-unsupported-features/node-builtins
const multer = require('multer');
const Card = require('./../models/bCardModel');
const User = require('./../models/userModel');

exports.getAllcards = async (req, res) => {
  try {
    const allCards = await Card.find({});

    res.status(200).json(allCards);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createCard = async (req, res) => {
  try {
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
    }); // didnt use only with req.body, because security isues

    res.status(200).json({
      status: 'success',
      data: newCard
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getOneCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'problem with URL details' });
    }
    const oneCard = await Card.findById(id).select('-createdAt');
    if (!oneCard) {
      return res.status(404).json({ status: 'fail', message: 'there is no such id' });
    }
    res.status(200).json(oneCard);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.upDateCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'problem with URL details' });
    }
    const oneCard = await Card.findByIdAndUpdate(id, req.body, {
      new: true, // new for returning the new object instead of the old one
      runValidators: true // running schema validation also when updating
    });
    if (!oneCard) {
      return res.status(404).json({ status: 'failed', message: 'There is no such Id' });
    }
    res.status(200).json({
      status: 'success',
      data: oneCard
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};
exports.deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'problem with URL details' });
    }
    const deleted = await Card.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ status: 'failed', message: 'There is no such Id' });
    }
    res.status(204).json({
      status: 'item has been deleted',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};
exports.getMyCards = async (req, res) => {
  try {
    const decoded = req.user; // getting the user data from the middleware
    const myCards = await Card.find({ user_id: decoded.id }).select('-createdAt');

    res.status(200).json(myCards);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.setFavorite = async (req, res) => {
  const cardId = req.params.id;
  const userId = req.user.id;
  let status = false;

  try {
    const card = await Card.findById(cardId);
    const user = await User.findById(userId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const cardIndex = card.favorites.indexOf(userId);
    const userIndex = user.favorites.indexOf(cardId);
    if (cardIndex === -1) {
      // User has not favorited the card, add to favorites
      card.favorites.push(userId);
      status = true;
    } else {
      // User has already favorited the card, remove from favorites
      card.favorites.splice(cardIndex, 1);
      status = false;
    }
    if (userIndex === -1) {
      // User has not favorited the card, add to favorites
      user.favorites.push(cardId);
    } else {
      // User has already favorited the card, remove from favorites
      user.favorites.splice(userIndex, 1);
    }

    await card.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    const { title } = card;

    return res.status(200).json({ title, status });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUserFavoriteCards = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteCards = user.favorites;

    return res.status(200).json({ favoriteCards });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};
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
