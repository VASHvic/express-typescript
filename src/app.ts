import express, {Request, Response} from 'express';
import cors from 'cors';
import {MongoService} from './database/database';

const app = express();

app.use(express.json());
app.use(cors());

const mongo = new MongoService();

app.get('/', (_, res: Response): Response<JSON> => {
  return res.json({
    routes: {
      get: [
        {'/': 'Api routes info'},
        {'/getall': 'get all documents available'},
        {'/getallids': "get array of all sensor Id's"},
        {'/getall/last': 'agregation of last data from each sensor'},
        {'getall/:id': 'get all data from the id requested'},
        {'getone/:id': 'get last info from the id requested'},
      ],
      post: [{'/': 'insert data into colleciton'}],
    },
  });
});

app.get('/getall', async (_, res: Response): Promise<Response<JSON[] | Error>> => {
  try {
    const collection = await mongo.connect();
    const documents = await mongo.getAll(collection);
    return res.send(documents);
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});
app.get('/getallids', async (_, res: Response): Promise<Response<String[] | Error>> => {
  try {
    const collection = await mongo.connect();
    const ids = await mongo.getAllSensorIds(collection);
    return res.send(ids);
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});

app.get('/getall/last', async (_, res: Response): Promise<Response<JSON[] | Error>> => {
  try {
    const collection = await mongo.connect();
    const documents = await mongo.getAllLast(collection);
    return res.send(documents);
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});

app.get(
  '/getall/:id',
  async (req: Request, res: Response): Promise<Response<JSON[] | Error>> => {
    const collection = await mongo.connect();
    const sensorId = req.params?.id;
    const last = await mongo.getAllInfoFromId(collection, sensorId);
    return res.send(last);
  }
);
app.get(
  '/getone/:id',
  async (req: Request, res: Response): Promise<Response<JSON[] | Error>> => {
    const collection = await mongo.connect();
    const sensorId = req.params?.id;
    const last = await mongo.getLastOne(collection, sensorId);
    return res.send(last);
  }
);

app.post('/', async (req: Request, res: Response): Promise<Response<boolean | Error>> => {
  try {
    const collection = await mongo.connect();
    const insert = await mongo.insertFullData(collection, req.body);
    return res.send(insert);
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
});

app.get('*', (_, res: Response): Response<String> => {
  return res.status(301).send('Route not Found');
});

export {app};
