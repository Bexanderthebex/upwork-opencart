import express from 'express';

import user from '../../controllers/user';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  router.get('/findUniqueUser',
    findUniqueUser,
    returnUser
  );

  router.get('/getTotalCustomer',
    getTotalCustomers,
    returnUser
  );

  router.get('/getTotalOnline',
    getTotalOnline,
    returnUser
  );

  router.get('/getMostReturnedUser',
    getMostReturnedUser,
    returnUser
  );

  router.get('/getTopStoker',
    getTopStoker,
    returnUser
  );

  router.get('/getTopPicker/:p_type',
    getTopPicker,
    returnUser  
  );

  router.get('/getTopHaular/:delivery',
    getTopHaular,
    returnUser
  );

  router.get('/getRecentActivity',
    getRecentActivity,
    returnUser
  );

  router.get('/getUniqueTransactions',
    getUniqueTransactions,
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

  function returnUser (req, res) {
    res.json(req.item);
  }

  return router;
}