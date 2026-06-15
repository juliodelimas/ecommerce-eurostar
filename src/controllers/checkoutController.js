const checkoutService = require('../services/checkoutService');

function checkout(req, res, next) {
  try {
    const result = checkoutService.checkout(req.body, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = { checkout };
