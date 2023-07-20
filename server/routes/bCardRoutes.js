const express = require('express');

const router = express.Router();
const cardController = require('./../controllers/bCardController');
const authController = require('./../controllers/authController');

router
  .route('/') //http://localhost:7800/api/cards
  .get(cardController.getAllcards)
  .post(
    authController.protector,
    cardController.uploadCardPhoto,
    cardController.createCard
  );
//http://localhost:7800/api/cards/my
// router.get('/homepageCards', authController.protector, cardController.getHomePageCards);
router.get(
  '/getUserFavoriteCards',
  authController.protector,
  cardController.getUserFavoriteCards
);
router.get('/my', authController.protector, cardController.getMyCards);

router
  .route('/:id') //http://localhost:7800/api/cards/:id
  .get(cardController.getOneCard)
  .patch(authController.protector, cardController.upDateCard)
  .delete(authController.protector, cardController.deleteCard);

router.put('/:id/favorite', authController.protector, cardController.setFavorite);

module.exports = router;
