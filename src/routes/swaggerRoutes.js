const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerController = require('../controllers/swaggerController');

const router = express.Router();
const swaggerDocument = swaggerController.getSwaggerDocument();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;
