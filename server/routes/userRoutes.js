const express = require('express');

const router = express.Router();

const authController = require('./../controllers/authController');
const userController = require('../controllers/userController');

router.post('/signup', authController.signUp); //http://localhost:7800/api/users/signup
router.post('/login', authController.logIn); //http://localhost:7800/api/users/login
router.get('/me', authController.protector, userController.getUser); // http://localhost:7800/api/users/me
router.patch(
  '/updateMe',
  authController.protector,
  userController.uploadUserPhoto,
  userController.updateUser
);
// router.patch('/updateMe', upload.single('photo'), userController.updateUser);

router.post('/forgotPassword', authController.forgotPassword);
router.post('/updatePassword', authController.protector, authController.updatePassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get(
  '/allUsers',
  authController.protector,
  authController.restrictTo('admin'),
  userController.getAllUsers
);

router.patch(
  '/adminSet',
  authController.protector,
  authController.restrictTo('admin'),
  userController.adminSetUp
);
router.delete(
  '/deleteUser/:id',
  authController.protector,
  authController.restrictTo('admin'),
  userController.userDelete
);

module.exports = router;
