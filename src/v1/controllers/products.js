import getConnection from '../../utils/db';

function getTotalOrders () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT COUNT(*) AS total FROM oc_order WHERE order_status_id > '0';`;
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

function getMostSoldItems () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT op.product_id, op.name, op.model, 
        count(op.product_id) as cnt, p.image from oc_order_product as op 
        INNER JOIN oc_product as p ON op.product_id = p.product_id 
        group by op.product_id order by count(op.product_id) desc limit 50;`;
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

function getMostAvailableItems () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `select p.product_id, pd.name, p.model, p.quantity, p.image 
        from oc_product as p INNER JOIN oc_product_description as pd 
        ON p.product_id = pd.product_id  order by p.quantity desc limit 50;`;
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

function getTopProductRevenue () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `select op.product_id, op.name, op.model, count(op.product_id) as cnt, 
        sum(p.price) as revenue, p.image from oc_order_product as op 
        INNER JOIN oc_product as p ON op.product_id = p.product_id 
        group by op.product_id order by revenue desc limit 50;`;
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

function getMostReturnedItems () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `select p.product_id, op.model, count(op.model) as cnt, p.image, d.name 
        from oc_return as op INNER JOIN oc_product as p ON op.model = p.model 
        INNER JOIN oc_product_description as d ON p.product_id = d.product_id 
        group by op.model order by count(op.model) desc limit 50;`;
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

function getMostNotifyMeItems () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT count(n.product_id) as cnt, p.* 
        FROM oc_out_of_stock_notify as n INNER JOIN oc_product as p 
        ON n.product_id = p.product_id group by p.product_id 
        order by count(n.product_id) DESC limit 50;`;
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
  getTotalOrders,
  getMostSoldItems,
  getMostAvailableItems,
  getTopProductRevenue,
  getMostReturnedItems,
  getMostNotifyMeItems
}