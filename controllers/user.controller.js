const User = require('../models/user.model');
const SampleData = require('../sample_data.json');
const {
  RESPONSE_STATUS,
  RESPONSES,
  RESPONSE_MESSAGES,
} = require('../constants/constants');

exports.importData = async (req, res) => {
  try {
    await User.deleteMany({});
    const insert = await User.insertMany(SampleData);
    if (insert && insert.length)
      return res.status(RESPONSE_STATUS.SUCCESS).json({
        response: RESPONSES.SUCCESS,
        message: RESPONSE_MESSAGES.SUCCESS,
      });
    else throw new Error('Failed to import all the data');
  } catch (err) {
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getUsersByIncomeAndCarBrand = async (req, res) => {
  try {
    const data = await User.find({
      $or: [{ car: 'BMW' }, { car: 'Mercedes-Benz' }],
    });

    const filteredUsers = data.filter((user) => {
      const income = parseInt(user.income.replace('$', '').replace(',', ''));
      return income < 5;
    });

    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: filteredUsers,
    });
  } catch (err) {
    res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getMaleUsersByPhonePrice = async (req, res) => {
  try {
    const data = await User.find({
      gender: 'Male',
    });
    const filteredUsers = data.filter(
      (user) => parseInt(user.phone_price) > 10000
    );

    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: filteredUsers,
    });
  } catch (err) {
    res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getUsersByLastNameAndQuoteLength = async (req, res) => {
  try {
    const data = await User.find({
      last_name: { $regex: /^M/i },
      email: { $regex: /M.*@/i },
      quote: { $exists: true, $regex: /^.{15,}$/ },
    });
    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: data,
    });
  } catch (err) {
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getUsersByCarBrandAndEmail = async (req, res) => {
  try {
    const data = await User.find({
      car: { $in: ['BMW', 'Mercedes-Benz', 'Audi'] },
      email: { $not: /[\d]/ },
    });
    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: data,
    });
  } catch (err) {
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getTopCitiesAndAvgIncome = async (req, res) => {
  try {
    const data = await User.aggregate()
      .group({
        _id: '$city',
        count: { $sum: 1 },
        totalIncome: { $sum: { $toDouble: { $substr: ['$income', 1, -1] } } },
      })
      .sort({ count: -1 })
      .limit(10)
      .exec();

    for (let city of data) {
      city.avgIncome = city.totalIncome / city.count;
      delete city.totalIncome;
    }

    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: data,
    });
  } catch (err) {
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const data = await User.find({});
    res.status(RESPONSE_STATUS.SUCCESS).json({
      response: RESPONSES.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: data,
    });
  } catch (err) {
    return res.status(RESPONSE_STATUS.ERROR).json({
      response: RESPONSES.ERROR,
      message: err,
    });
  }
};
