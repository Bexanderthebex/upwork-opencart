import getConnection from '../../utils/db';

//getProducts
//filters include name, model(product code), price, quantity, status, sort by, order(asc/desc)
function getProducts(filter){
  return new Promise((resolve, reject) =>{
    getConnection((err, connection) => {
      var query = `
      SELECT *, datediff(now(), barcode_time) as age 
      FROM oc_product p LEFT JOIN oc_product_description pd ON (p.product_id = pd.product_id) 
      WHERE pd.language_id = 1 `;

      if(typeof filter.name !== 'undefined'){
        query = query + "AND pd.name LIKE '%" + filter.name + "%' ";
      }
      if(typeof filter.model !== 'undefined'){
        query = query + "AND p.model = " + filter.model + " ";
      }
      if(typeof filter.price !== 'undefined'){
        query = query + "AND p.price LIKE '%" + filter.price + "%' ";
      }
      if(typeof filter.quantity !== 'undefined'){
        query = query + "AND p.quantity = " + filter.quantity + " ";
      }
      if(typeof filter.status !== 'undefined'){
        query = query + "AND p.status = " + filter.status + " ";
      } 
      if(typeof filter.sort !== 'undefined'){
        query = query + "ORDER BY " + filter.sort + " ";
      }

      else{
        query = query + "ORDER BY pd.name "; 
      }

      if(typeof filter.order !== 'undefined'){
        query = query + filter.order + " ";
      }
      else{
        query = query + "DESC "; 
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

/* general edit data */
function editProuctName (productName, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctMetaTagTitle (productMetaTagTitle, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctDescription (productDescription, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctMetaTagDescription (productMetaTagDescription, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctTag (productTag, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctMetaTagKeywords (productMetaTagKeywords, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

/* product data edit */

function editProuctCode (productCode, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctSKU (productSKU, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctUPC (productUPC, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctCondition (productCondition, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctLocation (productLocation, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctOurPrice (productOurPrice, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctCondition (productCondition, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctLocation (productLocation, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctPrice (productPrice, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctQuantity (productQuantity, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctSeoUrl(productSeoUrl, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctDateAvailable (productDateAvailable, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctSubtrackStock (productSubtractStock, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

function editProuctStatus (productStatus, productId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      // insert query here

      // resolve or reject logic
    });
  });
}

/* dashboard product queries */
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

function getLastFourStockingReport () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT CONCAT(u.firstname, ' ', u.lastname) as name, 
        COUNT(s.id) as total FROM oc_user_stock_history AS s 
        INNER JOIN oc_user as u ON s.user_id = u.user_id  
        WHERE s.user_id IN(SELECT user_id from oc_user_activity 
        WHERE logout is null) and stock_time > (NOW() - INTERVAL 240 MINUTE) 
        GROUP BY s.user_id ORDER BY total ASC;`;
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

function getLatestItemReturn () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT return_action_id, count(return_id) as refunded 
        FROM oc_return group by return_action_id;`;
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

function getLatestOrders () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `SELECT o.order_id, CONCAT(o.firstname, ' ', o.lastname) 
        AS customer, (SELECT os.name FROM oc_order_status os 
        WHERE os.order_status_id = o.order_status_id AND os.language_id = 1) 
        AS status, o.shipping_code, o.total, o.currency_code, o.currency_value, 
        o.date_added, o.date_modified FROM oc_order o 
        WHERE o.order_status_id > '0' order by o.date_added DESC LIMIT 0,5;`;
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
  getProducts,
  getTotalOrders,
  getMostSoldItems,
  getMostAvailableItems,
  getTopProductRevenue,
  getMostReturnedItems,
  getMostNotifyMeItems,
  getLastFourStockingReport,
  getLatestItemReturn,
  getLatestOrders
}