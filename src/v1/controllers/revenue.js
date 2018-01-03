import getConnection from '../../utils/db';

function getTotalRevenue () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        'SELECT sum(total) as ttl  from oc_order;';
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

function getTopCategoryRevenue () {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query =
        `select DISTINCT(cd.category_id) as cid,  cd.name as category_name, 
        sum(p.price) as revenue, cd.description as category_description 
        from oc_order_product as op INNER JOIN oc_product as p ON op.product_id = p.product_id 
        LEFT JOIN oc_product_to_category as c ON p.product_id = c.product_id 
        LEFT JOIN oc_category_description as cd ON c.category_id = cd.category_id 
        group by cd.category_id order by revenue desc limit 50;`;
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
  getTotalRevenue,
  getTopCategoryRevenue
}