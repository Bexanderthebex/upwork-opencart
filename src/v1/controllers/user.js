import getConnection from '../../utils/db';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';

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

//delete a customer with a given id
function deleteCustomer (id) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      //used a procedure since in the PHP code, there were multiple delete statements
      var query = 'CALL delete_customer(' + id + ');';
      // console.log(query);
      connection.query(query, (err, result) => {
        if(err) {
          console.log(err);
          reject(err);
        }
        connection.release();
        resolve(result);
      });
    
        // resolve();
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

// x
function findEmail (email) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = `SELECT email FROM oc_customer WHERE '${email}' LIKE email`;
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

// check if email is valid. uses validator.js x
function validateEmail (email) {
  return new Promise((resolve, reject) => {
    const valid = isEmail(email);
    resolve(valid);
  });
}

function generateSalt () {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      err ? reject(err) : resolve(salt);
    });
  });
}

function hashPassword (password, salt) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, key) => {
      err ? reject(err) : resolve(key);
    });
  });
}

function addCustomer (user, password, salt) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      //put add insert user here
      var query = 
        `
          INSERT INTO oc_customer 
            (
              customer_group_id, 
              firstname, 
              lastname,
              email,
              telephone,
              fax,
              custom_field,
              newsletter,
              salt,
              password,
              status,
              approved,
              safe,
              date_added 
            )
          VALUES 
            (
              ${user.customer_group_id},
              "${user.firstname}",
              "${user.lastname}",
              "${user.email}",
              "${user.telephone}",
              "${user.fax}",
              "${user.custom_field}",
              "${user.newsletter}",
              "${salt}",
              "${password}",
              ${user.status},
              ${user.approved},
              ${user.safe},
              NOW()
            );
          SELECT LAST_INSERT_ID() as 'customer_id';
        `;
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

//insert customer address then return primary key that is not affected
//by other insert since it is maintained per connection basis
function addCustomerAddress (address, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      var query = 
        `
          INSERT INTO oc_address 
            (
              customer_id,
              firstname,
              lastname,
              company,
              address_1,
              address_2,
              city,
              postcode,
              country_id,
              zone_id,
              custom_field
            )
          VALUES
            (
              ${customerId},
              "${address.firstname}",
              "${address.lastname}",
              "${address.company}",
              "${address.address_1}",
              "${address.address_2}",
              "${address.city}",
              "${address.postcode}",
              ${address.country_id},
              ${address.zone_id},
              "${address.custom_field}"
            );
          SELECT LAST_INSERT_ID() as 'address_id';
        `;
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

function addCustomerDefaultAddress (addressId, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query = 
        `
          UPDATE oc_customer SET address_id = ${addressId} 
          WHERE customer_id = ${customerId};
        `;
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

function editCustomerGroup (customerGroupId, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET customer_group_id = ${customerGroupId}
          WHERE customer_id = ${customerId}
        `;
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
//start 
function editCustomerFirstName (customerFirstName, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET firstname = "${customerFirstName}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerLastName (customerLastName, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET lastname = "${customerLastName}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerEmail (customerEmail, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET email = "${customerEmail}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerTelephone (customerTelephone, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET telephone = "${customerTelephone}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerFax (customerFax, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET fax = "${customerFax}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerSalt (customerSalt, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET salt = "${customerSalt}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerPassword (customerPassword, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET password = "${customerPassword}"
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerNewsletter (customerNewletter, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET newsletter = ${customerNewletter}
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerStatus (customerStatus, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET status = ${customerStatus}
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerApproved (customerApproved, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET approved = ${customerApproved}
          WHERE customer_id = ${customerId}
        `;
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

function editCustomerSafe (customerSafe, customerId) {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {

      var query =
        `
          UPDATE oc_customer SET safe = ${customerSafe}
          WHERE customer_id = ${customerId}
        `;
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
  getUniqueTransactions,
  findEmail,
  validateEmail,
  generateSalt,
  hashPassword,
  addCustomer,
  addCustomerAddress,
  addCustomerDefaultAddress,
  editCustomerGroup,
  editCustomerFirstName,
  editCustomerLastName,
  editCustomerEmail,
  editCustomerTelephone,
  editCustomerFax,
  editCustomerSalt,
  editCustomerPassword,
  editCustomerNewsletter,
  editCustomerStatus,
  editCustomerApproved,
  editCustomerSafe
}


