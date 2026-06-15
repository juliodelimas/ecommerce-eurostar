const express = require('express');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const healthRoutes = require('./routes/healthRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.use('/', authRoutes);
app.use('/', checkoutRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

module.exports = app;
