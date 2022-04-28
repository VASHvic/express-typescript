import {MongoClient} from 'mongodb';
import {MONGODB_URI} from '../config';

const client = new MongoClient(MONGODB_URI);

export async function getAll(): Promise<any[] | string> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.find({}).sort({$natural: -1}).toArray();
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
