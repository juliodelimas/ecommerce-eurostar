const { expect } = require('chai');
const request = require('supertest');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('API Path Coverage', () => {
  describe('GET /healthcheck', () => {
    it('should verify the API is running', async () => {
      const res = await request(BASE_URL)
        .get('/healthcheck')
        .expect(200);

      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('timestamp');
    });
  });

  describe('POST /register', () => {
    it('should create a new user account', async () => {
      const res = await request(BASE_URL)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'mypassword',
        })
        .expect(201);

      expect(res.body).to.have.property('user');
      expect(res.body.user).to.include({
        email: 'john@example.com',
        name: 'John Doe',
      });
      expect(res.body).to.have.property('token');
    });
  });

  describe('POST /login', () => {
    it('should authenticate and return a JWT token', async () => {
      const res = await request(BASE_URL)
        .post('/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body).to.have.property('user');
      expect(res.body.user).to.include({
        id: 1,
        email: 'alice@example.com',
        name: 'Alice Johnson',
      });
      expect(res.body).to.have.property('token');
    });
  });

  describe('POST /checkout', () => {
    it('should perform a checkout with cash payment', async () => {
      const loginRes = await request(BASE_URL)
        .post('/login')
        .send({
          email: 'alice@example.com',
          password: 'password123',
        })
        .expect(200);

      const token = loginRes.body.token;

      const res = await request(BASE_URL)
        .post('/checkout')
        .set('Authorization', `Bearer ${token}`)
        .send({
          items: [
            { productId: 1, quantity: 2 },
            { productId: 3, quantity: 1 },
          ],
          paymentMethod: 'cash',
        })
        .expect(200);

      expect(res.body).to.have.property('orderId');
      expect(res.body).to.have.property('userId', 1);
      expect(res.body).to.have.property('paymentMethod', 'cash');
      expect(res.body).to.have.property('subtotal', 249.97);
      expect(res.body).to.have.property('discount', 25.0);
      expect(res.body).to.have.property('discountRate', '10%');
      expect(res.body).to.have.property('total', 224.97);
      expect(res.body.items).to.have.lengthOf(2);
    });
  });
});
