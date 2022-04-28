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
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertFullData = exports.getAllInfoFromId = exports.getLastInfo = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const client = new mongodb_1.MongoClient(config_1.MONGODB_URI);
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            return yield collection.find({}).sort({ $natural: -1 }).toArray();
        }
        catch (err) {
            return err;
        }
    });
}
exports.getAll = getAll;
function getLastInfo(sensorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            data: { $elemMatch: { id: `NoiseLevelObserved-HOPVLCi${sensorId}` } },
        };
        const options = {
            sort: { $natural: -1 },
            // projection: {body: 1},
        };
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            return yield collection.findOne(query, options);
        }
        catch (err) {
            return err;
        }
    });
}
exports.getLastInfo = getLastInfo;
function getAllInfoFromId(sensorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = {
            data: { $elemMatch: { id: `NoiseLevelObserved-HOPVLCi${sensorId}` } },
        };
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            return yield collection.find(query).toArray();
        }
        catch (err) {
            return err;
        }
    });
}
exports.getAllInfoFromId = getAllInfoFromId;
function insertFullData(json) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            return yield collection.insertOne(json);
        }
        catch (err) {
            return err;
        }
    });
}
exports.insertFullData = insertFullData;
