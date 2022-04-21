import {MongoClient} from 'mongodb';
import {MONGODB_URI} from '../config';

const client = new MongoClient(MONGODB_URI);

export async function getAll(): Promise<any[] | string> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.find({}).sort({insertDate: -1}).toArray();
  } catch (err) {
    console.log(err);
    return err.message;
  } finally {
    await client.close();
  }
}
export async function getLastInfo(id: string): Promise<any> {
  const query = {sensorId: id};
  console.log(query);
  const options: any = {
    sort: {insertDate: -1},
    projection: {_id: 1, insertDate: 1, sensorId: 1, value: 1},
  };

  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    const lastInfo = await collection.findOne(query, options);
    return lastInfo;
  } catch (err) {
    console.log(err);
    return err.message;
  } finally {
    await client.close();
  }
}

export async function insertFullData(json: any): Promise<any> {
  try {
    await client.connect();
    const database = client.db('sensors');
    const collection = database.collection('brokerData');
    return await collection.insertOne(json);
  } catch (err) {
    console.log(err);
    return err.message;
  } finally {
    await client.close();
  }
}
