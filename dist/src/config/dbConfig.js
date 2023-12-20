"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('postgresql://postgres:2EG2Dg53Ad2eABCF-2FF-fBG45GGBg4c@monorail.proxy.rlwy.net:55875/railway');
exports.default = sequelize;
