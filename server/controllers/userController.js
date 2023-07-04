const User = require('./../models/userModel');

exports.getUser = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).sort({ active: 1 });
    if (!allUsers) {
      return res.status(400).json({
        status: 'fail',
        message: 'There are no users to serve'
      });
    }
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateUser = async (req, res) => {
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

  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.adminSetUp = async (req, res) => {
  const { _id, bizChecked, active } = req.body;

  try {
    const currentUser = await User.findById(_id);
    currentUser.bizChecked = bizChecked;
    currentUser.active = active;

    const data = await currentUser.save();
    res.status(200).json({ status: 'success', data: data });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'problem with URL details' });
    }
    const deleted = await User.findByIdAndDelete(id);
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
