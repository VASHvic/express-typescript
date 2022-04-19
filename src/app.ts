import express from 'express';
import cors from 'cors';
import {getAll, insertFullData, getLastInfo} from './database/database';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', async (_, res) => {
  const documents = await getAll();
  res.send(documents);
});

app.get('/:id', async (req, res) => {
  const id = req.params.id;
  const last = await getLastInfo(id);
  console.log('👻', last);
  res.send(last);
});

app.post('/', async (req, res) => {
  const info = req.body;
  const sensorId = req.body.body.subscriptionId;
  info.insertDate = new Date();
  info.sensorId = sensorId;
  try {
    const insert = await insertFullData(info);
    res.send(insert);
  } catch (err) {
    console.log(err);
  }
});

export {app};
