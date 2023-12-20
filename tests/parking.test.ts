import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

const token = jwt.sign({ user: "user" }, process.env.SECRET_KEY!, { expiresIn: '1h' });


describe('POST /api/parking', () => {

  it('should fail if parking spots are less than 50', async () => {
    const res = await request(app)
      .post('/api/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Small Parking', spots: 40, contact: '123456789', parkingType: 'private' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('too small');
  });

  it('should fail if parking spots are more than 1500', async () => {
    const res = await request(app)
      .post('/api/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Huge Parking', spots: 1501, contact: '123456789', parkingType: 'public' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('too big');
  });
});


describe('POST /api/parking', () => {
  it('should create a new parking', async () => {
    const res = await request(app)
      .post('/api/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Parking Test 1',
        spots: 100,
        contact: '123456789',
        parkingType: 'public'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

});

describe('POST /api/parking', () => {
  it('should fail creating new register because duplicate name', async () => {
    const res = await request(app)
      .post('/api/parking')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Parking Test 1',
        spots: 100,
        contact: '123456789',
        parkingType: 'public'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('Duplicated name');
  });

});

describe('GET /api/parking', () => {
  it('should retrieve a list of parkings', async () => {
    const res = await request(app)
      .get('/api/parking')
      .set('Authorization', `Bearer ${token}`)
      .query({ skip: 0, limit: 10, order: 'name' });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});



describe('POST /api/parking/checkIn', () => {
  const publicParkingId = '6904f752-e067-41e9-b809-36ebf684cca3';
  const privateParkingId = '7daf1062-3060-400b-b904-92ee8ebe5172';
  const courtesyParkingId = '3b284e85-75a7-46cb-9571-babce53747a1';

  it('should allow check-in for public parking for any user type', async () => {
    const userTypes = ['corporate', 'provider', 'visitor'];
    for (const userType of userTypes) {
      const res = await request(app)
        .post('/api/parking/checkIn')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: publicParkingId, userType });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Access granted');
    }
  });

  it('should only allow corporate users to check-in at private parking on weekdays', async () => {
    const date = new Date();
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      const res = await request(app)
        .post('/api/parking/checkIn')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: privateParkingId, userType: 'corporate' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Access granted');
    }
  });

  it('should deny non-corporate users to check-in at private parking', async () => {
    const userTypes = ['provider', 'visitor'];
    for (const userType of userTypes) {
      const res = await request(app)
        .post('/api/parking/checkIn')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: privateParkingId, userType });
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('Access denied');
    }
  });

  it('should only allow visitor users to check-in at courtesy parking on weekends', async () => {
    const date = new Date();
    if (date.getDay() === 0 || date.getDay() === 6) {
      const res = await request(app)
        .post('/api/parking/checkIn')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: courtesyParkingId, userType: 'visitor' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Access granted');
    }
  });

  it('should deny access to non-visitor users at courtesy parking on weekends', async () => {
    const userTypes = ['corporate', 'provider'];
    for (const userType of userTypes) {
      const res = await request(app)
        .post('/api/parking/checkIn')
        .set('Authorization', `Bearer ${token}`)
        .send({ parkingId: courtesyParkingId, userType });
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toContain('Access denied');
    }
  });

});
