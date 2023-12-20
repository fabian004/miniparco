"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.checkIn = exports.updateParking = exports.getAllParkings = exports.createParking = void 0;
const parkingService = __importStar(require("../services/parkingService"));
const parkingValidationFactory_1 = require("../utils/parkingValidationFactory");
const parkingModel_1 = __importDefault(require("../models/parkingModel"));
const createParking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { name, spots } = req.body;
        if (spots < 50)
            throw new Error('Parking is too small');
        if (spots > 1500)
            throw new Error('Parking is too big');
        const existingParking = yield parkingModel_1.default.findOne({ where: { name } });
        if (existingParking) {
            throw new Error('Duplicated name');
        }
        const parking = yield parkingService.createParking(req.body);
        res.status(201).json(parking);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred 2' });
        }
    }
});
exports.createParking = createParking;
const getAllParkings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const order = req.query.order || 'name';
        const parkings = yield parkingService.getAllParkings(skip, limit, order);
        res.json(parkings);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.getAllParkings = getAllParkings;
const updateParking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parkingId = req.params.id;
        const { spots, contact } = req.body;
        if (spots < 50)
            throw new Error('Parking is too small');
        if (spots > 1500)
            throw new Error('Parking is too big');
        const updatedParking = yield parkingService.updateParking(parkingId, { spots, contact });
        res.json(updatedParking);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.updateParking = updateParking;
const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parkingId, userType } = req.body;
        const parking = yield parkingModel_1.default.findByPk(parkingId);
        if (!parking) {
            res.status(404).json({ message: "Parking not found" });
            return;
        }
        const validator = (0, parkingValidationFactory_1.getParkingValidator)(parking.parkingType);
        const isValid = validator.validate(userType);
        if (!isValid) {
            res.status(403).json({ message: "Access denied" });
            return;
        }
        res.status(200).json({ message: "Access granted" });
    }
    catch (error) {
        res.status(500).json({ message: "error in Check In" });
    }
});
exports.checkIn = checkIn;
