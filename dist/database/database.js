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
exports.insertFullData = exports.getLastInfo = exports.getAll = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
const client = new mongodb_1.MongoClient(config_1.MONGODB_URI);
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            return yield collection.find({}).limit(10).sort({ insertDate: -1 }).toArray();
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
        finally {
            yield client.close();
        }
    });
}
exports.getAll = getAll;
function getLastInfo(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = { sensorId: id };
        console.log(query);
        const options = {
            sort: { insertDate: -1 },
            projection: { _id: 1, insertDate: 1, sensorId: 1, value: 1 },
        };
        try {
            yield client.connect();
            const database = client.db('sensors');
            const collection = database.collection('brokerData');
            const lastInfo = yield collection.findOne(query, options);
            return lastInfo;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
        finally {
            yield client.close();
        }
    });
}
exports.getLastInfo = getLastInfo;
function insertFullData(json) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = 0;
        if (counter === 60) {
            try {
                yield client.connect();
                const database = client.db('sensors');
                const collection = database.collection('brokerData');
                return yield collection.insertOne(json);
            }
            catch (err) {
                console.log(err);
                return undefined;
            }
            finally {
                counter = 0;
                yield client.close();
            }
        }
        else {
            counter++;
            console.log('data not inserted yet, counter at: ', counter);
            return counter;
        }
    });
}
exports.insertFullData = insertFullData;
