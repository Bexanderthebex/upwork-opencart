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


  //check if email exists first
  //if yes, return email already exists
  //else, check if email is valid
  //create salt and hash password
  router.post('/customer/add',
    findEmail,
    validateEmail,
    printUser
  );

  router.delete('/customer/:id',
    deleteCustomer,
    returnUser
  );

  router.get('/customer',
    getCustomers,
    returnUser
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
      req.user = await user.findEmail(req.body.email);
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

      req.isEmailValid = await user.validateEmail(req.body.email);
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


  async function hashPassword (req, res, next) {
    try {
      req.password = await user.hashPassword();
      next();
    } catch (err) {
      next(err);
    }
  }

  //last step
  async function createCustomer (req, res, next) {
    try {
      req.user = await user.findEmail(req.body.email);
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

  //dev function. remove this in production
  function printUser (req, res) {
    res.json(req.user);
  }

  function returnUser (req, res) {
    res.json(req.item);
  }

  return router;
}