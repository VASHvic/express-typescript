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
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const documents = yield (0, database_1.getAll)();
    res.send(documents);
}));
app.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const last = yield (0, database_1.getLastInfo)(id);
    console.log('👻', last);
    res.send(last);
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const info = req.body;
    const sensorId = req.body.body.subscriptionId;
    info.insertDate = new Date();
    info.sensorId = sensorId;
    try {
        const insert = yield (0, database_1.insertFullData)(info);
        res.send(insert);
    }
    catch (err) {
        console.log(err);
    }
}));
