import {Collection, MongoClient} from 'mongodb';
import {MONGODB_URI} from '../config';

export class MongoService {
  client = new MongoClient(MONGODB_URI);

  async connect() {
    try {
      await this.client.connect();
      return this.client.db('sensors').collection('brokerData');
    } catch (err) {
      return err;
    }
  }

  async getAll(collection: Collection) {
    try {
      return await collection.find({}).sort({$natural: -1}).toArray();
    } catch (err) {
      return err;
    }
  }
  async getAllLast(collection: Collection) {
    try {
      return await collection
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
              doc: {$first: '$$ROOT'},
            },
          },
        ])
        .toArray();
    } catch (err) {
      return err;
    }
  }
  async insertFullData(collection: Collection, json: any): Promise<boolean | unknown> {
    try {
      const {acknowledged} = await collection.insertOne(json);
      return acknowledged;
    } catch (err: unknown) {
      return err;
    }
  }
  async getAllInfoFromId(
    collection: Collection,
    sensorId: string
  ): Promise<any[] | unknown> {
    const query = {
      data: {$elemMatch: {id: `NoiseLevelObserved-HOPVLCi${sensorId}`}},
    };
    try {
      return await collection.find(query).toArray();
    } catch (err: unknown) {
      return err;
    }
  }

  async getAllSensorIds(collection: Collection): Promise<String[] | unknown> {
    try {
      return await collection.distinct('data.id');
    } catch (err) {
      return err;
    }
  }
}
