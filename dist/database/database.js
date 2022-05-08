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
exports.MongoService = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
class MongoService {
    constructor() {
        this.client = new mongodb_1.MongoClient(config_1.MONGODB_URI || '');
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                return this.client.db('sensors').collection('brokerData');
            }
            catch (err) {
                return err;
            }
        });
    }
    getAll(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield collection.find({}).sort({ $natural: -1 }).toArray();
            }
            catch (err) {
                return err;
            }
        });
    }
    getAllLast(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield collection
                    .aggregate([
                    {
                        $unwind: {
                            path: '$data',
                        },
                    },
                    {
                        $sort: {
                            'data.LAeq.metadata.TimeInstant.value': -1,
                        },
                    },
                    {
                        $group: {
                            _id: '$data.id',
                            doc: { $first: '$$ROOT' },
                        },
                    },
                ])
                    .toArray();
            }
            catch (err) {
                return err;
            }
        });
    }
    insertFullData(collection, json) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { acknowledged } = yield collection.insertOne(json);
                return acknowledged;
            }
            catch (err) {
                return err;
            }
        });
    }
    getAllInfoFromId(collection, sensorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                data: { $elemMatch: { id: `NoiseLevelObserved-HOPVLCi${sensorId}` } },
            };
            try {
                return yield collection.find(query).toArray();
            }
            catch (err) {
                return err;
            }
        });
    }
    getAllSensorIds(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield collection.distinct('data.id');
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.MongoService = MongoService;
