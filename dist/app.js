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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./database/database");
const app = express_1.default();
exports.app = app;
app.use(express_1.default.json());
app.use(cors_1.default());
const mongo = new database_1.MongoService();
app.get('/', (_, res) => {
    return res.json({
        routes: {
            get: ['/', '/getall', '/getallids', '/getall/last', 'getall/:id'],
            post: ['/'],
        },
    });
});
app.get('/getall', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield mongo.connect();
        const documents = yield mongo.getAll(collection);
        return res.send(documents);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}));
app.get('/getallids', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield mongo.connect();
        const ids = yield mongo.getAllSensorIds(collection);
        return res.send(ids);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}));
app.get('/getall/last', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield mongo.connect();
        const documents = yield mongo.getAllLast(collection);
        return res.send(documents);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}));
app.get('/getall/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const collection = yield mongo.connect();
    const sensorId = (_a = req.params) === null || _a === void 0 ? void 0 : _a.id;
    const last = yield mongo.getAllInfoFromId(collection, sensorId);
    return res.send(last);
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield mongo.connect();
        const insert = yield mongo.insertFullData(collection, req.body);
        return res.send(insert);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
}));
app.get('*', (_, res) => {
    return res.status(301).send('Route not Found');
});
