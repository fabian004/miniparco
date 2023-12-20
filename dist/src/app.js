"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const parkingRoutes_1 = __importDefault(require("./routes/parkingRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/parking', parkingRoutes_1.default);
const PORT = process.env.PORT || 3500;
if (process.env.NODE_ENV !== 'test') {
    dbConfig_1.default.authenticate()
        .then(() => {
        console.log('Connection to the database has been established successfully.');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
        .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
}
exports.default = app;
