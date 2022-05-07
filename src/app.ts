import express, {Request, Response} from 'express';
import cors from 'cors';
import {MongoService} from './database/database';
const app = express();
app.use(express.json());

//TODO: llevar cors?
app.use(cors());

const mongo = new MongoService();

app.get('/', (_, res: Response): Object => {
  return res.json({
    routes: {get: ['/', '/getall', '/getall/last', 'get/:id', 'getall/:id'], post: ['/']},
  });
});

app.get('/getall', async (_, res: Response) => {
  const collection = await mongo.connect();
  const documents = await mongo.getAll(collection);
  return res.send(documents);
});

app.get('/getall/last', async (_, res: Response): Promise<any[] | Object> => {
  const collection = await mongo.connect();
  const documents = await mongo.getAllLast(collection);
  return res.send(documents);
});

app.post('/', async (req: Request, res: Response) => {
  const collection = await mongo.connect();
  const insert = await mongo.insertFullData(collection, req.body);
  return res.send(insert);
});

// app.get('/getall/:id', async (req: Request, res: Response) => {
//   const sensorId = req.params?.id;
//   const last = await getAllInfoFromId(sensorId);
//   return res.send(last);
// });

// app.get('/get/:id', async (req: Request, res): Promise<any> => {
//   const sensorId = req.params?.id;
//   const info = await getLastInfo(sensorId);
//   return res.send(info);
// });

// app.post('/', async (req: Request, res): Promise<boolean | Object> => {
//   try {
//     const [data] = req.body.data;
//     console.log(data.id);
//     if (data.id) {
//       req.body.myId = data.id;
//     }
//     const insert = await insertFullData(req.body);
//     return res.send(insert);
//   } catch (err) {
//     return res.json({
//       error: {
//         message: err.message,
//       },
//     });
//   }
// });

export {app};
