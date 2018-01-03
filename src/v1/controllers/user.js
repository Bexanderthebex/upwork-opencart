import getConnection from '../../utils/db';

//get unique users
function findUniqueUsers () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
        'SELECT COUNT( DISTINCT(ip_address)) as ttl from oc_user_truck;';
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getTotalCustomers () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 'SELECT COUNT(*) AS total FROM oc_customer;'
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getTotalOnline () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
      `SELECT count(*) FROM oc_customer_online co 
      LEFT JOIN oc_customer c ON (co.customer_id = c.customer_id);`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getMostReturnedUser () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
        `select op.firstname, op.customer_id, op.lastname, 
        count(op.customer_id) as cnt, op.email, op.telephone from oc_return as op 
        group by op.customer_id order by count(op.customer_id) desc limit 50;`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getTopStoker () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
        `SELECT count(p.barcode_user_id) as cnt, p.barcode_user_id as 
        user_id, c.firstname, c.lastname, c.email, c.phone  FROM oc_product 
        as p INNER JOIN oc_user as c ON p.barcode_user_id = c.user_id 
        group by p.barcode_user_id order by count(p.barcode_user_id) DESC limit 50;`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getTopPicker (p_type) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = `SELECT count(p.assinged_to) as cnt, p.assinged_to as 
      user_id, c.firstname, c.lastname, c.email, c.phone  
      FROM oc_order_pickuptime as p INNER JOIN oc_user as c 
      ON p.assinged_to = c.user_id where p.type = '${p_type}' and p.status = '2' 
      group by p.assinged_to order by count(p.assinged_to) DESC limit 50;`;
      connection.query(query, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function getTopHoular (delivery) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT count(p.assinged_to) as cnt, c.firstname, p.assinged_to as 
        user_id, c.lastname, c.email, c.phone  FROM oc_order_pickuptime as p 
        INNER JOIN oc_user as c ON p.assinged_to = c.user_id where p.type = '${delivery}' 
        and p.status = '2' group by p.assinged_to order by count(p.assinged_to) 
        DESC limit 50;`;
      connection.query(query, (err, result) => {
        if (err) {
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
  findUniqueUsers,
  getTotalCustomers,
  getTotalOnline,
  getMostReturnedUser,
  getTopStoker,
  getTopPicker,
  getTopHoular
}


