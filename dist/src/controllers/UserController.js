"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => {
    const { username } = req.body;
    const user = { username };
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({
        accessToken
    });
};
exports.login = login;
