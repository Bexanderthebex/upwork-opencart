import getConnection from '../../utils/db';

//get unique users
function findUniqueUsers() {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
        'SELECT COUNT( DISTINCT(ip_address)) as ttl from oc_user_truck;';
      connection.query(query, (err, result) => {
        if (err){
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

export default {
  findUniqueUsers
}


