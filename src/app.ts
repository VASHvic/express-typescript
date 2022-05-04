import express from 'express';
import cors from 'cors';
import {
  getAll,
  insertFullData,
  getLastInfo,
  getAllInfoFromId,
  getAllLast,
} from './database/database';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.json({routes: {get: ['/', '/getall', 'get/:id'], post: ['/']}});
});

app.get('/getall', async (_, res) => {
  const documents = await getAll();
  res.send(documents);
});
app.get('/getall/last', async (_, res) => {
  const documents = await getAllLast();
  res.send(documents);
});

app.get('/getall/:id', async (req, res) => {
  const sensorId = req.params.id;
  const last = await getAllInfoFromId(sensorId);
  res.send(last);
});

app.get('/get/:id', async (req, res) => {
  const sensorId = req.params.id;
  const info = await getLastInfo(sensorId);
  res.send(info);
});

app.post('/', async (req, res) => {
  try {
    const [data] = req.body.data;
    console.log(data.id);

    if (data.id) {
      req.body.myId = data.id;
    }
    const insert = await insertFullData(req.body);
    res.send(insert);
  } catch (err) {
    res.json({
      error: {
        message: err.message,
      },
    });
  }
});

export {app};
