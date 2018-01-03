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

//get all customers with filtered results
//filter can contain the ff. attributes
//  name, customer_group(int), date_added(Y-m-d), email, approved(int), status(int), 
//  ip_address, and sort(use actual attribute names(ex. id, name) ,default is name).
function getCustomers(filter){
  return new Promise((resolve, reject) =>{
    getConnection((err, connection) => {
      var query = `SELECT *, CONCAT(c.firstname, ' ', c.lastname) AS name, cgd.name AS customer_group 
                  FROM oc_customer c LEFT JOIN oc_customer_group_description cgd ON (c.customer_group_id = cgd.customer_group_id) 
                  WHERE cgd.language_id = 1 `;
      if(typeof filter.name!== 'undefined'){
        query = query + "AND CONCAT(c.firstname, '', c.lastname) LIKE '%" + filter.name + "%' ";
      }
      if(typeof filter.customer_group !== 'undefined'){
        query = query + "AND c.customer_group_id = " + filter.customer_group + " ";
      }
      if(typeof filter.date_added !== 'undefined'){
        query = query + "AND DATE(c.date_added) = DATE('" + filter.date_added + "') ";
      }
      if(typeof filter.email !== 'undefined'){
        query = query + "AND c.email LIKE '%" + filter.email + "%' ";
      }
      if(typeof filter.approved !== 'undefined'){
        query = query + "AND c.approved = " + filter.approved + " ";
      }
      if(typeof filter.status !== 'undefined'){
        query = query + "AND c.status = " + filter.status + " ";
      }
      if(typeof filter.ip_address !== 'undefined'){
        query = query + "AND (SELECT customer_id FROM oc_customer_ip WHERE ip = '" + filter.ip_address + "')";
      }

      if(typeof filter.sort !== 'undefined'){
        query = query + "ORDER BY " + filter.sort + " ";
      }
      else{
        query = query + "ORDER BY name "; 
      }

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

function approveCustomer (id) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = '';
      connection.query(query, (err, result) => {
        if(err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    });
  });
}

function deleteCustomer (id) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = '';
      connection.query(query, (err, result) => {
        if(err) {
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

function getTopHaular (delivery) {
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

function getRecentActivity (delivery) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT a.key, a.data, a.date_added FROM ((SELECT CONCAT('customer_', ca.key) 
        AS 'key', ca.data, ca.date_added FROM oc_customer_activity ca) 
        UNION (SELECT CONCAT('affiliate_', aa.key) AS 'key', aa.data, aa.date_added 
        FROM oc_affiliate_activity aa)) a ORDER BY a.date_added DESC LIMIT 0,5;`;
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

function getUniqueTransactions () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        'SELECT COUNT(DISTINCT(customer_id)) as ttl from  oc_order';
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
  approveCustomer,
  deleteCustomer,
  findUniqueUsers,
  getCustomers,
  getTotalCustomers,
  getTotalOnline,
  getMostReturnedUser,
  getTopStoker,
  getTopPicker,
  getTopHaular,
  getRecentActivity,
  getUniqueTransactions
}


