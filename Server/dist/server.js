"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const UserRoute_1 = __importDefault(require("./route/UserRoute"));
const AdminRoute_1 = __importDefault(require("./route/AdminRoute"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/', UserRoute_1.default);
app.use('/admin', AdminRoute_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
    res.send("hello world");
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
