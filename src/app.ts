import express from 'express';
import cors from 'cors';
import {getAll, insertFullData, getLastInfo} from './database/database';

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

app.get('/get/:id', async (req, res) => {
  const sensorId = req.params.id;
  const last = await getLastInfo(sensorId);
  res.send(last);
});

app.post('/', async (req, res) => {
  try {
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
