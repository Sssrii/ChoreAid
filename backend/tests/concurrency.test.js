require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../src/models/User');
const ServiceCategory = require('../src/models/ServiceCategory');
const ServiceRequest = require('../src/models/ServiceRequest');

describe('Concurrent request acceptance', () => {
  let customerToken, providerAToken, providerBToken, categoryId, requestId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/choreaid_test');

    // Create a customer
    const customerRes = await request(app).post('/api/auth/register').send({
      name: 'Test Customer', email: 'concurrency_customer@test.com', password: 'test1234', role: 'customer',
    });
    const loginCustomer = await request(app).post('/api/auth/login').send({
      email: 'concurrency_customer@test.com', password: 'test1234',
    });
    console.log('LOGIN RESPONSE:', JSON.stringify(loginCustomer.body));
    customerToken = loginCustomer.body.data.token;

    // Create two providers
    await request(app).post('/api/auth/register').send({
      name: 'Provider A', email: 'concurrency_providerA@test.com', password: 'test1234', role: 'provider',
    });
    const loginA = await request(app).post('/api/auth/login').send({
      email: 'concurrency_providerA@test.com', password: 'test1234',
    });
    providerAToken = loginA.body.data.token;

    await request(app).post('/api/auth/register').send({
      name: 'Provider B', email: 'concurrency_providerB@test.com', password: 'test1234', role: 'provider',
    });
    const loginB = await request(app).post('/api/auth/login').send({
      email: 'concurrency_providerB@test.com', password: 'test1234',
    });
    providerBToken = loginB.body.data.token;

    // Create a category
    const category = await ServiceCategory.create({ name: 'TestServiceConcurrency' });
    categoryId = category._id;

    // Create a service request directly with status MATCHING
    const customer = await User.findOne({ email: 'concurrency_customer@test.com' });
    const serviceRequest = await ServiceRequest.create({
      customer: customer._id,
      category: categoryId,
      description: 'Test job',
      address: 'Test address',
      status: 'MATCHING',
    });
    requestId = serviceRequest._id;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: /concurrency_/ });
    await ServiceCategory.deleteMany({ name: 'TestServiceConcurrency' });
    await ServiceRequest.deleteMany({ _id: requestId });
    await mongoose.connection.close();
  });

  test('only one of two simultaneous accept attempts should succeed', async () => {
    // Fire both accept requests at the same time
    const [resA, resB] = await Promise.all([
      request(app).put(`/api/requests/${requestId}/accept`).set('Authorization', `Bearer ${providerAToken}`),
      request(app).put(`/api/requests/${requestId}/accept`).set('Authorization', `Bearer ${providerBToken}`),
    ]);

    console.log('RESULT A:', JSON.stringify(resA.body));
    console.log('RESULT B:', JSON.stringify(resB.body));
    const results = [resA.body.success, resB.body.success];

    
    // Exactly one should have succeeded, one should have failed
    expect(results.filter((r) => r === true).length).toBe(1);
    expect(results.filter((r) => r === false).length).toBe(1);
  });
});