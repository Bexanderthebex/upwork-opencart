import express from 'express';

import message from '../../controllers/message';
import errors from '../../../utils/errors';

export default function () {
  var router = express.Router();

  router.post('/customer/send',
  	sendMessagetoCustomer,
  	returnUser
  );

  router.delete('/customer/:id',
  	deleteMessagesfromCustomer,
  	returnUser
  );

  router.get('/customer/:id',
    getMessagesfromCustomer,
    returnUser
  );


  router.get('/customer',
  	getCustomers,
  	returnUser
  );




  async function getCustomers(req, res, next){
    try {
      req.item = await message.getCustomers(req.query);
      if (!req.item) {
        return next(new errors.NotFound('Customers not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function getMessagesfromCustomer(req, res, next){
    try {
      req.item = await message.getMessagesfromCustomer(req.params.id);
      if (!req.item) {
        return next(new errors.NotFound('Messages not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }
  //specific only for admin to customer, different implementation needed for customer to admin
  async function sendMessagetoCustomer(req, res, next){
    try {
      var admin_id = 62; //hardcoded admin's user id for now, must be acquired through sessions once live
      console.log(req.body);
      req.item = await message.sendMessagetoCustomer(admin_id,req.body.customer_id, req.body.message);
      if (!req.item) {
        return next(new errors.NotFound('Customer not found'));
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async function deleteMessagesfromCustomer(req, res, next){
    try {
      req.item = await message.deleteMessagesfromCustomer(req.params.id);
      if (!req.item) {
        return next(new errors.NotFound('Customer not found'));
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