import mysql from 'mysql';

var pool = mysql.createPool({
  connectionLimit: 100,
  connectTimeout: 5000,
  acquireTimeout: 5000,
  queueLimit: 30,
  host: 'baskt-rds.cleh19qtij3m.us-east-2.rds.amazonaws.com',
  user: 'awsdata',
  password: 'Ap1Jqb3n5FK0UZzW4RwUJ1Yn',
  database: 'baskt_rds',
  multipleStatements: true,
});

var getConnection = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) return callback(err);
    callback(err, connection);
  })
};

pool.on('acquire', (connection) => {
  console.log('Connection %d acquired', connection.threadId);
});

module.exports = getConnection;
