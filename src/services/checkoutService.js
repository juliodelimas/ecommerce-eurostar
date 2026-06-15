const productModel = require('../models/productModel');

const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];
const CASH_DISCOUNT_RATE = 0.1;

function checkout({ items, paymentMethod }, userId) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    const error = new Error('Items array is required and must not be empty.');
    error.statusCode = 400;
    throw error;
  }

  if (!paymentMethod) {
    const error = new Error('Payment method is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    const error = new Error('Payment method must be "cash" or "credit_card".');
    error.statusCode = 400;
    throw error;
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = productModel.findById(item.productId);

    if (!product) {
      const error = new Error(`Product with id ${item.productId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    if (!item.quantity || item.quantity < 1) {
      const error = new Error(`Invalid quantity for product ${item.productId}.`);
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}.`);
      error.statusCode = 400;
      throw error;
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      itemTotal: parseFloat(itemTotal.toFixed(2)),
    });

    productModel.updateStock(product.id, item.quantity);
  }

  const discount = paymentMethod === 'cash' ? subtotal * CASH_DISCOUNT_RATE : 0;
  const total = subtotal - discount;

  return {
    orderId: Date.now(),
    userId,
    items: orderItems,
    paymentMethod,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    discountRate: paymentMethod === 'cash' ? '10%' : '0%',
    total: parseFloat(total.toFixed(2)),
  };
}

module.exports = { checkout };
