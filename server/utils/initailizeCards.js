const Card = require('./../models/bCardModel');
const hardCodeJSON = require('./hardCodeCards.json');

const initializeFunction = async () => {
  const allCards = await Card.find({});
  if (allCards.length <= 0) {
    Card.create(hardCodeJSON);
  }
};

initializeFunction();
