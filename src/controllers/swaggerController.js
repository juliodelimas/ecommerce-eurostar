const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const swaggerPath = path.join(__dirname, '../../swagger.yaml');

function getSwaggerDocument() {
  const file = fs.readFileSync(swaggerPath, 'utf8');
  return yaml.load(file);
}

module.exports = { getSwaggerDocument };
