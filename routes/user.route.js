const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router
  .post('/importdata', UserController.importData)
  .get('/income-lt-5-bmw-merc', UserController.getUsersByIncomeAndCarBrand)
  .get('/male-phone-price-gt-10000', UserController.getMaleUsersByPhonePrice)
  .get(
    '/last-name-M-quote-gt-15-email-in',
    UserController.getUsersByLastNameAndQuoteLength
  )
  .get(
    '/bmw-merc-audi-email-no-digit',
    UserController.getUsersByCarBrandAndEmail
  )
  .get(
    '/top-10-cities-highest-users-avg-income',
    UserController.getTopCitiesAndAvgIncome
  )
  .get('/all-users', UserController.getAllUsers);

module.exports = router;
