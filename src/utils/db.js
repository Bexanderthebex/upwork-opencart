import mysql from 'mysql';
import express from 'express';

const app = express();

app.use( (req, res, next) => {
  res.locals.connection = mysql.createConnection({
    host:       'baskt-rds.cleh19qtij3m.us-east-2.rds.amazonaws.com',
    user:       'awsdata',
    password:   'Ap1Jqb3n5FK0UZzW4RwUJ1Yn',
    database:   'baskt_rds'
  });
  res.locals.connect();
  next();
});