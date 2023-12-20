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
exports.updateParking = exports.getAllParkings = exports.createParking = void 0;
const parkingModel_1 = __importDefault(require("../models/parkingModel"));
const createParking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return parkingModel_1.default.create(data);
});
exports.createParking = createParking;
const getAllParkings = (skip, limit, order) => __awaiter(void 0, void 0, void 0, function* () {
    return parkingModel_1.default.findAll({
        offset: skip * limit,
        limit: limit,
        order: [[order, 'ASC']]
    });
});
exports.getAllParkings = getAllParkings;
const updateParking = (parkingId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const parking = yield parkingModel_1.default.findByPk(parkingId);
    if (!parking)
        throw new Error('Estacionamiento no encontrado');
    if (data.spots !== undefined)
        parking.spots = data.spots;
    if (data.contact !== undefined)
        parking.contact = data.contact;
    yield parking.save();
    return parking;
});
exports.updateParking = updateParking;
