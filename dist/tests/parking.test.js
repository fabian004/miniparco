"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token = jsonwebtoken_1.default.sign({ user: "user" }, process.env.SECRET_KEY, { expiresIn: '1h' });
describe('POST /api/parking', () => {
    // ... (prueba existente)
    it('should fail if parking spots are less than 50', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/parking')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Small Parking', spots: 40, contact: '123456789', parkingType: 'private' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('too small');
    }));
    it('should fail if parking spots are more than 1500', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/parking')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Huge Parking', spots: 1501, contact: '123456789', parkingType: 'public' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('too big');
    }));
});
describe('POST /api/parking', () => {
    it('should create a new parking', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
});
describe('POST /api/parking', () => {
    it('should fail creating new register because duplicate name', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
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
    }));
});
describe('GET /api/parking', () => {
    it('should retrieve a list of parkings', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/parking')
            .set('Authorization', `Bearer ${token}`)
            .query({ skip: 0, limit: 10, order: 'name' });
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    }));
});
describe('POST /api/parking/checkIn', () => {
    const publicParkingId = '6904f752-e067-41e9-b809-36ebf684cca3';
    const privateParkingId = '7daf1062-3060-400b-b904-92ee8ebe5172';
    const courtesyParkingId = '3b284e85-75a7-46cb-9571-babce53747a1';
    it('should allow check-in for public parking for any user type', () => __awaiter(void 0, void 0, void 0, function* () {
        const userTypes = ['corporate', 'provider', 'visitor'];
        for (const userType of userTypes) {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/checkIn')
                .set('Authorization', `Bearer ${token}`)
                .send({ parkingId: publicParkingId, userType });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Access granted');
        }
    }));
    it('should only allow corporate users to check-in at private parking on weekdays', () => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date();
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/checkIn')
                .set('Authorization', `Bearer ${token}`)
                .send({ parkingId: privateParkingId, userType: 'corporate' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Access granted');
        }
    }));
    it('should deny non-corporate users to check-in at private parking', () => __awaiter(void 0, void 0, void 0, function* () {
        const userTypes = ['provider', 'visitor'];
        for (const userType of userTypes) {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/checkIn')
                .set('Authorization', `Bearer ${token}`)
                .send({ parkingId: privateParkingId, userType });
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Access denied');
        }
    }));
    it('should only allow visitor users to check-in at courtesy parking on weekends', () => __awaiter(void 0, void 0, void 0, function* () {
        const date = new Date();
        if (date.getDay() === 0 || date.getDay() === 6) {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/checkIn')
                .set('Authorization', `Bearer ${token}`)
                .send({ parkingId: courtesyParkingId, userType: 'visitor' });
            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toContain('Access granted');
        }
    }));
    it('should deny access to non-visitor users at courtesy parking on weekends', () => __awaiter(void 0, void 0, void 0, function* () {
        const userTypes = ['corporate', 'provider'];
        for (const userType of userTypes) {
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/api/parking/checkIn')
                .set('Authorization', `Bearer ${token}`)
                .send({ parkingId: courtesyParkingId, userType });
            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toContain('Access denied');
        }
    }));
});
