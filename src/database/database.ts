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
    return await collection.find({}).sort({$natural: -1}).toArray();
  }
  async getAllLast(collection: Collection) {
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
  }
  async insertFullData(collection: Collection, json: any): Promise<boolean> {
    const {acknowledged} = await collection.insertOne(json);
    return acknowledged;
  }
}

// export async function getAll(): Promise<any[] | Error> {
//   try {
//     await client.connect();
//     const database = client.db('sensors');
//     const collection = database.collection('brokerData');
//     return await collection.find({}).sort({$natural: -1}).toArray();
//   } catch (err) {
//     return err;
//   }
// }
// export async function getAllLast(): Promise<any[] | Error> {
//   try {
//     await client.connect();
//     const database = client.db('sensors');
//     const collection = database.collection('brokerData');
//     return await collection
//       .aggregate([
//         {
//           $unwind: {
//             path: '$data',
//           },
//         },
//         {
//           $sort: {
//             'data.LAeq.metadata.TimeInstant.value': -1,
//           },
//         },
//         {
//           $group: {
//             _id: '$data.id',
//             doc: {$first: '$$ROOT'},
//           },
//         },
//       ])
//       .toArray();
//   } catch (err) {
//     return err;
//   }
// }
// export async function getLastInfo(sensorId: string): Promise<any> {
//   const query = {
//     data: {$elemMatch: {id: `NoiseLevelObserved-HOPVLCi${sensorId}`}},
//   };
//   const options: any = {
//     sort: {$natural: -1},
//   };

//   try {
//     await client.connect();
//     const database = client.db('sensors');
//     const collection = database.collection('brokerData');
//     return await collection.findOne(query, options);
//   } catch (err) {
//     return err;
//   }
// }
// //TODO: afegir projecció als datos que fan falta per al array de la gráfica
// export async function getAllInfoFromId(sensorId: string): Promise<any> {
//   const query = {
//     data: {$elemMatch: {id: `NoiseLevelObserved-HOPVLCi${sensorId}`}},
//   };

//   try {
//     await client.connect();
//     const database = client.db('sensors');
//     const collection = database.collection('brokerData');
//     return await collection.find(query).toArray();
//   } catch (err) {
//     return err;
//   }
// }

// export async function insertFullData(json: any): Promise<boolean | Error> {
//   try {
//     await client.connect();
//     const database = client.db('sensors');
//     const collection = database.collection('brokerData');
//     const {acknowledged} = await collection.insertOne(json);
//     return acknowledged;
//   } catch (err) {
//     return err;
//   }
// }
