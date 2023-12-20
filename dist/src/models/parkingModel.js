"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
class Parking extends sequelize_1.Model {
}
Parking.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.UUIDV4,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    spots: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    contact: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    parkingType: {
        type: sequelize_1.DataTypes.ENUM('public', 'private', 'courtesy'),
        allowNull: false,
        field: 'parking_type'
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'created_at' // Define el nombre real de la columna en la base de datos
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'updated_at' // Define el nombre real de la columna en la base de datos
    }
}, {
    sequelize: dbConfig_1.default,
    tableName: 'parkings'
});
exports.default = Parking;
