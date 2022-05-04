import {MongoClient} from 'mongodb';
import {MONGODB_URI} from '../config';

const client = new MongoClient(MONGODB_URI);

export async function getAll(): Promise<any[] | Error> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.find({}).sort({$natural: -1}).toArray();
  } catch (err) {
    return err;
  }
}
export async function getAllLast(): Promise<any[] | Error> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
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
export async function getLastInfo(sensorId: string): Promise<any> {
  const query = {
    data: {$elemMatch: {id: `NoiseLevelObserved-HOPVLCi${sensorId}`}},
  };
  const options: any = {
    sort: {$natural: -1},
    // projection: {body: 1},
  };

  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.findOne(query, options);
  } catch (err) {
    return err;
  }
}
export async function getAllInfoFromId(sensorId: string): Promise<any> {
  const query = {
    data: {$elemMatch: {id: `NoiseLevelObserved-HOPVLCi${sensorId}`}},
  };

  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.find(query).toArray();
  } catch (err) {
    return err;
  }
}

export async function insertFullData(json: any): Promise<any> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.insertOne(json);
  } catch (err) {
    return err;
  }
}
