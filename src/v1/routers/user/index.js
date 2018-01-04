import express from 'express';

import user from '../../controllers/user';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  router.get('/unique',
    findUniqueUser,
    returnUser
  );

  router.get('/customer/total',
    getTotalCustomers,
    returnUser
  );

  router.get('/customer/online/total',
    getTotalOnline,
    returnUser
  );

  router.get('/customer/most/returned',
    getMostReturnedUser,
    returnUser
  );

  router.get('/customer/stoker/top',
    getTopStoker,
    returnUser
  );

  router.get('/customer/picker/top/:p_type',
    getTopPicker,
    returnUser  
  );

  router.get('/customer/haular/top/:delivery',
    getTopHaular,
    returnUser
  );

  router.get('/customer/activity/recent',
    getRecentActivity,
    returnUser
  );

  router.get('/customer/transactions/unique',
    getUniqueTransactions,
    returnUser
  );

  router.post('/customer/add',
    findEmail,
    validateEmail,
    generateSalt,
    hashPassword,
    addCustomer,
    addCustomerAddress,
    returnDone
  );

  router.delete('/customer/:id',
    deleteCustomer,
    returnUser
  );

  router.get('/customer',
    getCustomers,
    returnUser
  );

  router.put('/customer/edit/:customer_id',
    editCustomer,
    returnDone
  );

  async function findUniqueUser (req, res, next) {
    try {
      req.item = await user.findUniqueUsers();
      if (!req.item) {
        return next(new errors.NotFound('User not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTotalCustomers (req, res, next) {
    try {
      req.item = await user.getTotalCustomers();
      if (!req.item) {
        return next(new errors.NotFound('Total number of Customers not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTotalOnline (req, res, next) {
    try {
      req.item = await user.getTotalOnline();
      if (!req.item) {
        return next(
          new errors.NotFound('Total number of People online not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMostReturnedUser (req, res, next) {
    try {
      req.item = await user.getMostReturnedUser();
      if (!req.item) {
        return next(
          new errors.NotFound('Most Returned User not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopStoker (req, res, next) {
    try {
      req.item = await user.getTopStoker();
      if (!req.item) {
        return next(
          new errors.NotFound('Top Stoker not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopPicker (req, res, next) {
    try {
      req.item = await user.getTopPicker(req.params.p_type);
      if (!req.item) {
        return next(
          new errors.NotFound('Top Picker not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getTopHaular (req, res, next) {
    try {
      req.item = await user.getTopPicker(req.params.delivery);
      if (!req.item) {
        return next(
          new errors.NotFound('Top Hoular not found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getRecentActivity (req, res, next) {
    try {
      req.item = await user.getRecentActivity();
      if (!req.item) {
        return next(
          new errors.NotFound('Recent Activities Not Found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getUniqueTransactions (req, res, next) {
    try {
      req.item = await user.getUniqueTransactions ();
      if (!req.item) {
        return next(
          new errors.NotFound('Unique Transactions Not Found')
        );
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function findEmail (req, res, next) {
    try {
      if (!req.body.user.email) {
        return next(new errors.BadRequest('There is no email provided'));
      }
      req.user = await user.findEmail(req.body.user.email);
      next();
    } catch (err) {
      next(err);
    }
  }

  async function validateEmail (req, res, next) {
    try {
      if (req.user.length > 0) {
        return next(new errors.BadRequest('Email already registered'));
      }

      req.isEmailValid = await user.validateEmail(req.body.user.email);
      if (!req.isEmailValid) {
        return next(new errors.BadRequest('Email not valid'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getCustomers (req, res, next) {
    try {
      req.item = await user.getCustomers(req.query);
      if (!req.item) {
        return next(new errors.NotFound('Customers not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function generateSalt (req, res, next) {
    try {
      req.salt = await user.generateSalt();
      next();
    } catch (err) {
      next(err);
    }
  }

  async function hashPassword (req, res, next) {
    try {
      if (!req.body.user.password) {
        return next(new errors.BadRequest('There is no password provided'))
      }
      req.password = 
        await user.hashPassword(req.body.user.password, req.salt);
      next();
    } catch (err) {
      next(err);
    }
  }

  //last step
  async function createCustomer (req, res, next) {
    try {
      req.item = await user.approveCustomer(req.params.id);
      if (!req.item) {
        return next(new errors.NotFound('Customer not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function deleteCustomer(req, res, next){
    try {
      //just trying to make sure nothing else is deleted...
      if(typeof req.params.id!== 'undefined' && req.params.id!==null){
        req.item = await user.deleteCustomer(req.params.id);
        if (!req.item) {
          return next(new errors.NotFound('Customer not found'));
        }
        next();  
      }
    } catch (err) {
      next(err);
    }

  }

  async function addCustomer(req, res, next) {
    try {
      var customerId =
        await user.addCustomer(req.body.user, req.password, req.salt);

      if (!customerId) {
        return next(
          new errors.BadRequest('User was not successfully inserted')
        );
      }
      req.customerId = customerId[1][0].customer_id;
      next();
    } catch (err) {
      next(err);
    }
  }

  async function addCustomerAddress(req, res, next) {
    try {
      if (req.body.address && req.body.address.length >= 1) {
        if (req.body.address.length > 1) {
          for (var i = 0; i < req.body.address.length; i++) {
            if (req.body.address[i].default == true) {
              var customerId = req.customerId;
              var addressId =
                user.addCustomerAddress(
                  req.body.address[i],
                  req.customerId
                );
              //add the LAST_INSERT_ID() value as a parameter to:
              //addCustomerDefaultAddress()
              user.addCustomerDefaultAddress(
                addressId[1][0].address_id,
                req.customerId
              );

              continue;
            }
            user.addCustomerAddress(req.body.address[i], req.customerId);
          }
        }
        /* case for only one address */
        else if (req.body.address[0].default == true && req.body.address.length == 1) {
          var addressId = user.addCustomerAddress(
            req.body.address[0],
            req.customerId
          );

          //add the LAST_INSERT_ID() value as a parameter to:
          //addCustomerDefaultAddress()
          user.addCustomerDefaultAddress(
            addressId[1][0].address_id,
            req.customerId
          );
        } else {
          await user.addCustomerAddress(
            req.body.address[0],
            req.customerId
          );
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function editCustomer (req, res, next) {
    try {
      //check first if this required fields are present
      if (req.body.user.firstname == "" || !req.body.user.firstname) {
        return next(new errors.BadRequest('First name is required'));
      }
      if (req.body.user.lastname == "" || !req.body.user.lastname) {
        return next(new errors.BadRequest('Last name is required'));
      }
      if (req.body.user.email == "" || !req.body.user.email) {
        return next(new errors.BadRequest('email is required'));
      }
      if (req.body.user.telephone == "" || !req.body.user.telephone) {
        return next(new errors.BadRequest('telephone is required'));
      }
      if (req.body.user.password == "" || !req.body.user.password) {
        return next(new errors.BadRequest('password is required'));
      }

      //concurrent function execution
      const [
        resultFirstname, 
        resultLastname, 
        resultEmail, 
        resultTelephone,
        salt,
      ] = 
      await Promise.all([
        user.editCustomerFirstName(
          req.body.user.firstname,
          req.params.customer_id
        ),
        user.editCustomerLastName(
          req.body.user.lastname,
          req.params.customer_id
        ),
        user.editCustomerEmail(
          req.body.user.email,
          req.params.customer_id
        ),
        user.editCustomerTelephone(
          req.body.user.telephone,
          req.params.customer_id
        ),
        user.generateSalt(),
        
      ]);

      console.log(`salt: ${salt}`)
      user.editCustomerSalt(salt, req.params.customer_id);
      //make sure the salt is generated first
      const password = user.hashPassword(req.body.user.password, salt);

      //make sure the password is generated first 

      user.editCustomerPassword(password, req.params.customer_id);

      if (req.body.user.customer_group_id != "" || !req.body.user.customer_group_id) {
        user.editCustomerGroup(req.body.user.customer_group_id, req.params.customer_id);
      }
      if (req.body.user.fax != "" || !req.body.user.fax) {
        user.editCustomerFax(req.body.user.fax, req.params.customer_id);
      }
      if (req.body.user.newsletter != "" || !req.body.user.newsletter) {
        user.editCustomerNewsletter(req.body.user.newsletter, req.params.customer_id);
      }
      if (req.body.user.status != "" || !req.body.user.status) {
        user.editCustomerStatus(req.body.user.status, req.params.customer_id);
      }
      if (req.body.user.approved != "" || !req.body.user.approved) {
        user.editCustomerGroup(req.body.user.approved, req.params.customer_id);
      }
      if (req.body.user.safe != "" || !req.body.user.safe) {
        user.editCustomerGroup(req.body.user.safe, req.params.customer_id);
      }

      next();
    } catch (err) {
      next(err);
    }
  }

  function returnDone (req, res) {
    res.json("done");
  }

  function returnUser (req, res) {
    res.json(req.item);
  }

  return router;
}