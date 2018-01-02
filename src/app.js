import http from 'http';
import path from 'path';
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

// import api endpoints here
import api from './v1';
// import middleware here

const app = express();
const port = 3000;

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use('/v1', api());

http.createServer(app).listen(3000, () => {
  console.log(`API is listening on http://127.0.0.1:${port}`)
});