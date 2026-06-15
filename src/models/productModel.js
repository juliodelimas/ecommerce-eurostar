const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    stock: 50,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    stock: 30,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    price: 49.99,
    stock: 100,
  },
];

function findAll() {
  return [...products];
}

function findById(id) {
  return products.find((product) => product.id === id);
}

function updateStock(id, quantity) {
  const product = findById(id);
  if (!product) return null;
  product.stock -= quantity;
  return product;
}

module.exports = {
  findAll,
  findById,
  updateStock,
};
