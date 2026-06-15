import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const loginUsers = [
  { email: 'alice@example.com', password: 'password123' },
  { email: 'bob@example.com', password: 'password123' },
  { email: 'carol@example.com', password: 'password123' },
];

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '20s', target: 30 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    checks: ['rate>0.99'],
  },
};

export default function loginLoadTest() {
  const user = loginUsers[Math.floor(Math.random() * loginUsers.length)];
  const payload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  const response = http.post(`${BASE_URL}/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'POST /login' },
  });

  check(response, {
    'login status is 200': (res) => res.status === 200,
    'login response has token': (res) => res.json('token') !== undefined,
    'login response has user email': (res) => res.json('user.email') === user.email,
  });
}
