import {Collection, Document, MongoClient} from 'mongodb';
import {MONGODB_URI} from '../config';

export class MongoService {
  client = new MongoClient(MONGODB_URI);

  async connect(myDbName: string, myCollectionName: string): Promise<Collection> {
    try {
      await this.client.connect();
      return this.client.db(myDbName).collection(myCollectionName);
    } catch (err) {
      return err;
    }
  }

  async getAll(collection: Collection): Promise<Document[] | Error> {
    try {
      return await collection.find({}).sort({$natural: -1}).toArray();
    } catch (err) {
      return err;
    }
  }
  async getAllLast(collection: Collection): Promise<Document[] | Error> {
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
              LAeq: {$first: '$data.LAeq'},
              LA90: {$first: '$data.LA90'},
              address: {$first: '$data.address'},
            },
          },
        ])
        .toArray();
    } catch (err) {
      return err;
    }
  }
  async getLastOne(
    collection: Collection,
    sensorId: string
  ): Promise<Document[] | Error> {
    try {
      return await collection
        .find({mySensorId: `NoiseLevelObserved-HOPVLCi${sensorId}`})
        .project({
          _id: 0,
          subscriptionId: 0,
          myCreatedAt: 0,
          mySensorId: 0,
          data: {
            type: 0,
            LA99: 0,
            LAMax: 0,
            LAMin: 0,
            LA1: 0,
            LA50: 0,
            LA10: 0,
            location: 0,
            dateObservedFrom: 0,
            dateObservedTo: 0,
            operationalStatus: 0,
            noiseLevelLAEq: 0,
          },
        })
        .sort({$natural: -1})
        .limit(1)
        .toArray();
    } catch (err) {
      return err;
    }
  }
  async insertFullData(collection: Collection, json: any): Promise<boolean | Error> {
    try {
      const {acknowledged} = await collection.insertOne(json);
      return acknowledged;
    } catch (err) {
      return err;
    }
  }
  async getAllInfoFromId(
    collection: Collection,
    sensorId: string
  ): Promise<Document[] | Error> {
    const query = {
      mySensorId: `NoiseLevelObserved-HOPVLCi${sensorId}`,
      myCreatedAt: {$gt: new Date(Date.now() - 24 * 60 * 60 * 1000)},
    };
    try {
      return await collection
        .find(query)
        .project({
          _id: 0,
          subscriptionId: 0,
          myCreatedAt: 0,
          mySensorId: 0,
          data: {
            type: 0,
            LA99: 0,
            LAMax: 0,
            LAMin: 0,
            LA1: 0,
            LA50: 0,
            LA10: 0,
            location: 0,
            dateObservedFrom: 0,
            dateObservedTo: 0,
            operationalStatus: 0,
            noiseLevelLAEq: 0,
            LA90: 0,
            name: 0,
          },
        })
        .toArray();
    } catch (err) {
      return err;
    }
  }

  async getAllSensorIds(collection: Collection): Promise<String[] | Error> {
    try {
      return await collection.distinct('data.id');
    } catch (err) {
      return err;
    }
  }
}
